import { isBooleanAttributePresent, setBooleanAttribute } from "../../internal/attributes.ts";
import { defineElement } from "../../internal/define-element.ts";
import { containsPoint } from "../../internal/dom.ts";
import { dispatchSnytChangeEvent } from "../../internal/events.ts";
import { SnytOverlayStack } from "../../internal/overlay-stack.ts";
import { lockScroll } from "../../internal/scroll-lock.ts";
import {
  SNYT_DIALOG_CANCEL_EVENT,
  SNYT_DIALOG_CHANGE_EVENT,
  SNYT_DIALOG_CLOSE_ATTRIBUTE,
  SNYT_DIALOG_TAG_NAME,
  SNYT_DIALOG_TRIGGER_ATTRIBUTE,
} from "./constants.ts";
import {
  getClosestDialog,
  queryDialogParts,
  queryDialogStateElements,
  syncDialogAccessibilityAttributes,
} from "./parts.ts";
import {
  getDialogTriggerMode,
  isDefaultTrueAttributeEnabled,
  setDialogStateAttributes,
} from "./state.ts";
import type {
  SnytDialogCancelEventDetail,
  SnytDialogChangeEventDetail,
  SnytDialogChangeReason,
} from "./types.ts";

const HTMLElementBase =
  globalThis.HTMLElement ??
  (class {} as {
    new (): HTMLElement;
  });

const modalDialogStack = new SnytOverlayStack<SnytDialogElement>();

export class SnytDialogElement extends HTMLElementBase {
  static observedAttributes = ["disabled", "dismissible", "dismissable", "open"];

  private closeElements: HTMLElement[] = [];
  private descriptionElement: HTMLElement | null = null;
  private isModalOpen = false;
  private isSyncingAttributes = false;
  private mutationObserver: MutationObserver | null = null;
  private panelElement: HTMLElement | null = null;
  private pendingCloseReason: SnytDialogChangeReason | null = null;
  private pendingCloseTrigger: Element | null = null;
  private popupElement: HTMLDialogElement | null = null;
  private releaseScrollLock: (() => void) | null = null;
  private restoreFocusElement: HTMLElement | null = null;
  private titleElement: HTMLElement | null = null;
  private triggerElements: HTMLElement[] = [];

  get open() {
    return this.popupElement?.open ?? isBooleanAttributePresent(this, "open");
  }

  set open(value: boolean) {
    if (value) {
      this.showModal();
      return;
    }

    this.close(undefined, "api", null);
  }

  get disabled() {
    return isBooleanAttributePresent(this, "disabled");
  }

  set disabled(value: boolean) {
    setBooleanAttribute(this, "disabled", value);
  }

  get dismissible() {
    const spelling = this.hasAttribute("dismissible") ? "dismissible" : "dismissable";

    return isDefaultTrueAttributeEnabled(this, spelling);
  }

  set dismissible(value: boolean) {
    setBooleanAttribute(this, "dismissible", value);
  }

  connectedCallback() {
    this.setAttribute("data-snyt-component", "dialog");
    this.addEventListener("click", this.handleRootClick);
    this.syncParts();
    this.observeChildren();
    this.syncNestedState();
    this.syncStateAttributes();

    if (isBooleanAttributePresent(this, "open") && !this.popupElement?.open) {
      this.showModal(null, "api");
    }
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleRootClick);
    this.mutationObserver?.disconnect();
    this.detachPopupListeners();
    this.releaseOverlay();
  }

  attributeChangedCallback(name: string) {
    if (this.isSyncingAttributes) {
      return;
    }

    if (name === "open") {
      if (isBooleanAttributePresent(this, "open") && !this.popupElement?.open) {
        this.showModal(null, "api");
      } else if (!isBooleanAttributePresent(this, "open") && this.popupElement?.open) {
        this.close(undefined, "api", null);
      }
    }

    this.syncStateAttributes();
  }

  show(trigger: Element | null = null, reason: SnytDialogChangeReason = "api") {
    this.openDialog(false, reason, trigger);
  }

  showModal(trigger: Element | null = null, reason: SnytDialogChangeReason = "api") {
    this.openDialog(true, reason, trigger);
  }

  close(
    returnValue?: string,
    reason: SnytDialogChangeReason = "api",
    trigger: Element | null = null,
  ) {
    this.syncParts();

    if (!this.popupElement?.open) {
      return;
    }

    this.pendingCloseReason = reason;
    this.pendingCloseTrigger = trigger;
    this.popupElement.close(returnValue);
  }

  private handleRootClick = (event: MouseEvent) => {
    if (this.disabled) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const trigger = target.closest<HTMLElement>(`[${SNYT_DIALOG_TRIGGER_ATTRIBUTE}]`);

    if (trigger && getClosestDialog(trigger) === this) {
      event.preventDefault();
      event.stopPropagation();

      if (getDialogTriggerMode(trigger) === "show") {
        this.show(trigger, "trigger");
      } else {
        this.showModal(trigger, "trigger");
      }

      return;
    }

    const close = target.closest<HTMLElement>(`[${SNYT_DIALOG_CLOSE_ATTRIBUTE}]`);

    if (close && getClosestDialog(close) === this) {
      event.preventDefault();
      event.stopPropagation();
      this.close(undefined, "close", close);
    }
  };

  private handleNativeCancel = (event: Event) => {
    if (event.target !== this.popupElement) {
      return;
    }

    const canDismiss = this.dispatchCancelEvent("cancel", null);

    if (!this.dismissible || !canDismiss) {
      event.preventDefault();
      return;
    }

    this.pendingCloseReason = "cancel";
    this.pendingCloseTrigger = null;
  };

  private handleNativeClick = (event: MouseEvent) => {
    const popup = this.popupElement;

    if (
      event.target !== popup ||
      !popup?.open ||
      (this.isModalOpen && !modalDialogStack.isTopmost(this))
    ) {
      return;
    }

    const panel = this.panelElement ?? popup;

    if (containsPoint(panel, event.clientX, event.clientY)) {
      return;
    }

    if (!this.dispatchCancelEvent("light-dismiss", null) || !this.dismissible) {
      return;
    }

    event.stopPropagation();
    this.close(undefined, "light-dismiss", null);
  };

  private handleNativeClose = (event: Event) => {
    if (event.target !== this.popupElement) {
      return;
    }

    const reason = this.pendingCloseReason ?? "native";
    const trigger = this.pendingCloseTrigger;

    this.pendingCloseReason = null;
    this.pendingCloseTrigger = null;
    this.finishClose(reason, trigger);
  };

  private openDialog(modal: boolean, reason: SnytDialogChangeReason, trigger: Element | null) {
    this.syncParts();

    if (this.disabled || !this.popupElement || this.popupElement.open) {
      return;
    }

    this.restoreFocusElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.isModalOpen = modal;

    if (modal) {
      this.popupElement.showModal();
      modalDialogStack.add(this);
      this.releaseScrollLock = lockScroll(this);
    } else {
      this.popupElement.show();
    }

    this.syncStateAttributes();
    this.updateParentDialogState();
    this.dispatchChangeEvent(true, modal, reason, trigger);
  }

  private finishClose(reason: SnytDialogChangeReason, trigger: Element | null) {
    const wasModal = this.isModalOpen;

    this.releaseOverlay();
    this.isModalOpen = false;
    this.syncStateAttributes();
    this.updateParentDialogState();
    this.dispatchChangeEvent(false, wasModal, reason, trigger);
    this.restoreFocus();
  }

  private restoreFocus() {
    const element = this.restoreFocusElement;
    this.restoreFocusElement = null;

    if (!element?.isConnected) {
      return;
    }

    queueMicrotask(() => element.focus({ preventScroll: true }));
  }

  private releaseOverlay() {
    modalDialogStack.remove(this);
    this.releaseScrollLock?.();
    this.releaseScrollLock = null;
  }

  private dispatchChangeEvent(
    open: boolean,
    modal: boolean,
    reason: SnytDialogChangeReason,
    trigger: Element | null,
  ) {
    dispatchSnytChangeEvent<SnytDialogChangeEventDetail>(this, SNYT_DIALOG_CHANGE_EVENT, {
      modal,
      open,
      reason,
      trigger,
    });
  }

  private dispatchCancelEvent(
    reason: SnytDialogCancelEventDetail["reason"],
    trigger: Element | null,
  ) {
    return this.dispatchEvent(
      new CustomEvent<SnytDialogCancelEventDetail>(SNYT_DIALOG_CANCEL_EVENT, {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          reason,
          trigger,
        },
      }),
    );
  }

  private observeChildren() {
    this.mutationObserver?.disconnect();

    if (!globalThis.MutationObserver) {
      return;
    }

    this.mutationObserver = new MutationObserver(() => {
      this.syncParts();
      this.syncNestedState();
      this.syncStateAttributes();
    });
    this.mutationObserver.observe(this, { childList: true, subtree: true });
  }

  private syncParts() {
    const previousPopup = this.popupElement;

    const parts = queryDialogParts(this);
    this.popupElement = parts.popupElement;

    if (previousPopup !== this.popupElement) {
      this.detachPopupListeners(previousPopup);
      this.attachPopupListeners();
    }

    this.panelElement = parts.panelElement;
    this.titleElement = parts.titleElement;
    this.descriptionElement = parts.descriptionElement;
    this.triggerElements = parts.triggerElements;
    this.closeElements = parts.closeElements;

    this.syncAccessibilityAttributes();
  }

  private attachPopupListeners() {
    this.popupElement?.addEventListener("cancel", this.handleNativeCancel);
    this.popupElement?.addEventListener("click", this.handleNativeClick);
    this.popupElement?.addEventListener("close", this.handleNativeClose);
  }

  private detachPopupListeners(popup: HTMLDialogElement | null = this.popupElement) {
    popup?.removeEventListener("cancel", this.handleNativeCancel);
    popup?.removeEventListener("click", this.handleNativeClick);
    popup?.removeEventListener("close", this.handleNativeClose);
  }

  private syncAccessibilityAttributes() {
    syncDialogAccessibilityAttributes({
      closeElements: this.closeElements,
      descriptionElement: this.descriptionElement,
      disabled: this.disabled,
      open: this.open,
      panelElement: this.panelElement,
      popupElement: this.popupElement,
      titleElement: this.titleElement,
      triggerElements: this.triggerElements,
    });
  }

  private syncNestedState() {
    setBooleanAttribute(
      this,
      "data-nested",
      this.parentElement?.closest(SNYT_DIALOG_TAG_NAME) !== null,
    );
  }

  private updateParentDialogState() {
    const parent = this.parentElement?.closest(SNYT_DIALOG_TAG_NAME) as SnytDialogElement | null;

    if (!parent) {
      return;
    }

    const hasOpenChild = Array.from(
      parent.querySelectorAll<SnytDialogElement>(SNYT_DIALOG_TAG_NAME),
    ).some((dialog) => dialog !== parent && dialog.open);

    setBooleanAttribute(parent, "data-child-dialog-open", hasOpenChild);
  }

  private syncStateAttributes() {
    const open = this.popupElement?.open ?? isBooleanAttributePresent(this, "open");
    const modal = open && this.isModalOpen;

    this.isSyncingAttributes = true;
    setBooleanAttribute(this, "open", open);
    setBooleanAttribute(this, "data-disabled", this.disabled);
    setDialogStateAttributes(this, open, modal);
    this.isSyncingAttributes = false;

    this.syncAccessibilityAttributes();

    const stateTargets = queryDialogStateElements(this, this.popupElement, this.panelElement);

    for (const element of stateTargets) {
      setDialogStateAttributes(element, open, modal);
    }
  }
}

export function defineSnytDialog(
  registry: CustomElementRegistry | undefined = globalThis.customElements,
) {
  return defineElement(SNYT_DIALOG_TAG_NAME, SnytDialogElement, registry);
}
