import {
  isBooleanAttributePresent,
  setBooleanAttribute,
  setStringAttribute,
} from "../../internal/attributes.ts";
import { defineElement } from "../../internal/define-element.ts";
import { SnytOverlayStack } from "../../internal/overlay-stack.ts";
import { lockScroll } from "../../internal/scroll-lock.ts";
import {
  SNYT_DIALOG_BACKDROP_TAG_NAME,
  SNYT_DIALOG_CANCEL_EVENT,
  SNYT_DIALOG_CLOSE_EVENT,
  SNYT_DIALOG_OPEN_EVENT,
  SNYT_DIALOG_PANEL_TAG_NAME,
  SNYT_DIALOG_ROOT_TAG_NAME,
} from "./constants.ts";
import { getDialogStateElements, queryDialogParts } from "./parts.ts";
import { isDefaultTrueAttributeEnabled, setDialogStateAttributes } from "./state.ts";

const HTMLElementBase =
  globalThis.HTMLElement ??
  (class {} as {
    new (): HTMLElement;
  });

type DialogCloseMethod = HTMLDialogElement["close"];
type DialogOpenMethod = HTMLDialogElement["show"];
type DialogOpenModalMethod = HTMLDialogElement["showModal"];
type DialogRequestCloseMethod = HTMLDialogElement & {
  requestClose?: (returnValue?: string) => void;
};
type CommandAction = "close" | "request-close" | "show-modal";

export interface SnytDialogHideOptions {
  restoreFocus?: boolean;
}

const modalDialogStack = new SnytOverlayStack<SnytDialogRootElement>();

export class SnytDialogPanelElement extends HTMLElementBase {
  connectedCallback() {
    this.setAttribute("data-snyt-component", "dialog-panel");
  }
}

export class SnytDialogBackdropElement extends HTMLElementBase {
  connectedCallback() {
    this.setAttribute("data-snyt-component", "dialog-backdrop");
  }
}

export class SnytDialogRootElement extends HTMLElementBase {
  static observedAttributes = ["disabled", "dismissible", "open"];

  private commandElements: HTMLButtonElement[] = [];
  private backdropElements: HTMLElement[] = [];
  private isModalOpen = false;
  private isSyncingAttributes = false;
  private mutationObserver: MutationObserver | null = null;
  private originalClose: DialogCloseMethod | null = null;
  private originalRequestClose: ((returnValue?: string) => void) | null = null;
  private originalShow: DialogOpenMethod | null = null;
  private originalShowModal: DialogOpenModalMethod | null = null;
  private panelElement: HTMLElement | null = null;
  private pointerDownTarget: EventTarget | null = null;
  private popupElement: HTMLDialogElement | null = null;
  private releaseScrollLock: (() => void) | null = null;
  private restoreFocusElement: HTMLElement | null = null;
  private shouldRestoreFocus = true;

  get open() {
    return this.popupElement?.open ?? isBooleanAttributePresent(this, "open");
  }

  set open(value: boolean) {
    if (value) {
      this.show();
      return;
    }

    this.hide();
  }

  get disabled() {
    return isBooleanAttributePresent(this, "disabled");
  }

  set disabled(value: boolean) {
    setBooleanAttribute(this, "disabled", value);
  }

  get dismissible() {
    return isDefaultTrueAttributeEnabled(this, "dismissible");
  }

  set dismissible(value: boolean) {
    setBooleanAttribute(this, "dismissible", value);
  }

  connectedCallback() {
    this.setAttribute("data-snyt-component", "dialog-root");
    this.syncParts();
    this.observeChildren();
    this.attachDocumentListeners();
    this.syncNestedState();
    this.syncStateAttributes();

    if (isBooleanAttributePresent(this, "open") && !this.popupElement?.open) {
      this.show();
    }
  }

  disconnectedCallback() {
    this.mutationObserver?.disconnect();
    this.detachDocumentListeners();
    this.detachPopupListeners();
    this.restoreNativeMethods();
    this.releaseOverlay();
  }

  attributeChangedCallback(name: string) {
    if (this.isSyncingAttributes) {
      return;
    }

    if (name === "open") {
      if (isBooleanAttributePresent(this, "open") && !this.popupElement?.open) {
        this.show();
      } else if (!isBooleanAttributePresent(this, "open") && this.popupElement?.open) {
        this.hide({ restoreFocus: false });
      }
    }

    this.syncStateAttributes();
  }

  show() {
    this.syncParts();

    if (!this.popupElement) {
      return;
    }

    this.openNativeDialog("modal", () => this.originalShowModal?.call(this.popupElement));
  }

  hide({ restoreFocus = true }: SnytDialogHideOptions = {}) {
    this.syncParts();

    if (!this.popupElement?.open) {
      return;
    }

    this.shouldRestoreFocus = restoreFocus;
    this.closeNativeDialog(() => this.originalClose?.call(this.popupElement));
  }

  private openNativeDialog(mode: "modal" | "non-modal", open: () => void | undefined) {
    if (this.disabled || !this.popupElement || this.popupElement.open) {
      this.syncStateAttributes();
      return;
    }

    this.restoreFocusElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.shouldRestoreFocus = true;

    open();

    if (!this.popupElement.open) {
      this.syncStateAttributes();
      return;
    }

    this.isModalOpen = mode === "modal";

    if (this.isModalOpen) {
      modalDialogStack.add(this);
      this.releaseScrollLock = lockScroll(this, { referenceElement: this.popupElement });
    }

    this.syncStateAttributes();
    this.updateParentDialogState();
    this.dispatchEvent(new Event(SNYT_DIALOG_OPEN_EVENT));
  }

  private closeNativeDialog(close: () => void | undefined) {
    if (!this.popupElement?.open) {
      this.syncStateAttributes();
      return;
    }

    close();
  }

  private requestClose(returnValue?: string) {
    if (!this.popupElement?.open) {
      return;
    }

    if (!this.dispatchCancelEvent() || !this.dismissible) {
      return;
    }

    this.shouldRestoreFocus = true;
    this.closeNativeDialog(() => this.originalClose?.call(this.popupElement, returnValue));
  }

  private handleNativeCancel = (event: Event) => {
    if (event.target !== this.popupElement) {
      return;
    }

    if (!this.dispatchCancelEvent() || !this.dismissible) {
      event.preventDefault();
    }
  };

  private handleNativeClose = (event: Event) => {
    if (event.target !== this.popupElement) {
      return;
    }

    this.finishClose();
  };

  private handleDocumentClick = (event: MouseEvent) => {
    const target = event.target;
    const popup = this.popupElement;

    if (!(target instanceof Element) || !popup) {
      return;
    }

    const commandButton = target.closest<HTMLButtonElement>("button[commandfor][command]");

    if (commandButton?.getAttribute("commandfor") === popup.id) {
      this.handleCommandButtonClick(event, commandButton);
      return;
    }

    if (
      event.target !== this.pointerDownTarget ||
      !popup.open ||
      (this.isModalOpen && !modalDialogStack.isTopmost(this))
    ) {
      return;
    }

    if (this.panelElement && event.composedPath().includes(this.panelElement)) {
      return;
    }

    this.requestClose();
  };

  private handleDocumentPointerDown = (event: PointerEvent) => {
    this.pointerDownTarget = event.composedPath()[0] ?? event.target;
  };

  private handleCommandButtonClick(event: MouseEvent, button: HTMLButtonElement) {
    const popup = this.popupElement;
    const command = button.getAttribute("command")?.toLowerCase();

    if (!popup || !isCommandAction(command)) {
      return;
    }

    event.preventDefault();

    if (command === "show-modal") {
      this.restoreFocusElement = button;
      this.openNativeDialog("modal", () => this.originalShowModal?.call(popup));
      return;
    }

    if (command === "request-close") {
      this.requestClose(button.value);
      return;
    }

    this.shouldRestoreFocus = true;
    this.closeNativeDialog(() => this.originalClose?.call(popup, button.value));
  }

  private finishClose() {
    this.releaseOverlay();
    this.isModalOpen = false;
    this.syncStateAttributes();
    this.updateParentDialogState();
    this.dispatchEvent(new Event(SNYT_DIALOG_CLOSE_EVENT));
    this.restoreFocus();
  }

  private restoreFocus() {
    const element = this.restoreFocusElement;
    const shouldRestore = this.shouldRestoreFocus;
    this.restoreFocusElement = null;
    this.shouldRestoreFocus = true;

    if (!shouldRestore || !element?.isConnected) {
      return;
    }

    queueMicrotask(() => element.focus({ preventScroll: true }));
  }

  private releaseOverlay() {
    modalDialogStack.remove(this);
    this.releaseScrollLock?.();
    this.releaseScrollLock = null;
  }

  private dispatchCancelEvent() {
    return this.dispatchEvent(new Event(SNYT_DIALOG_CANCEL_EVENT, { cancelable: true }));
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
    this.mutationObserver.observe(this.ownerDocument, {
      attributeFilter: ["command", "commandfor"],
      childList: true,
      subtree: true,
    });
  }

  private syncParts() {
    const previousPopup = this.popupElement;
    const parts = queryDialogParts(this);
    this.popupElement = parts.popupElement;

    if (previousPopup !== this.popupElement) {
      this.detachPopupListeners(previousPopup);
      this.restoreNativeMethods(previousPopup);
      this.attachPopupListeners();
      this.wrapNativeMethods();
    }

    this.panelElement = parts.panelElement;
    this.backdropElements = parts.backdropElements;
    this.commandElements = parts.commandElements;
  }

  private attachPopupListeners() {
    this.popupElement?.addEventListener("cancel", this.handleNativeCancel);
    this.popupElement?.addEventListener("close", this.handleNativeClose);
  }

  private detachPopupListeners(popup: HTMLDialogElement | null = this.popupElement) {
    popup?.removeEventListener("cancel", this.handleNativeCancel);
    popup?.removeEventListener("close", this.handleNativeClose);
  }

  private attachDocumentListeners() {
    this.ownerDocument.addEventListener("pointerdown", this.handleDocumentPointerDown, true);
    this.ownerDocument.addEventListener("click", this.handleDocumentClick, true);
  }

  private detachDocumentListeners() {
    this.ownerDocument.removeEventListener("pointerdown", this.handleDocumentPointerDown, true);
    this.ownerDocument.removeEventListener("click", this.handleDocumentClick, true);
  }

  private wrapNativeMethods() {
    const popup = this.popupElement;

    if (!popup || this.originalClose || this.originalShow || this.originalShowModal) {
      return;
    }

    this.originalClose = popup.close.bind(popup);
    this.originalShow = popup.show.bind(popup);
    this.originalShowModal = popup.showModal.bind(popup);

    const requestClose = (popup as DialogRequestCloseMethod).requestClose;
    this.originalRequestClose =
      typeof requestClose === "function" ? requestClose.bind(popup) : null;

    popup.close = (returnValue?: string) => {
      this.shouldRestoreFocus = true;
      this.closeNativeDialog(() => this.originalClose?.call(popup, returnValue));
    };
    popup.show = () => this.openNativeDialog("non-modal", () => this.originalShow?.call(popup));
    popup.showModal = () =>
      this.openNativeDialog("modal", () => this.originalShowModal?.call(popup));

    if (this.originalRequestClose) {
      (popup as DialogRequestCloseMethod).requestClose = (returnValue?: string) =>
        this.requestClose(returnValue);
    }
  }

  private restoreNativeMethods(popup: HTMLDialogElement | null = this.popupElement) {
    if (!popup) {
      return;
    }

    if (this.originalClose) {
      popup.close = this.originalClose;
    }

    if (this.originalShow) {
      popup.show = this.originalShow;
    }

    if (this.originalShowModal) {
      popup.showModal = this.originalShowModal;
    }

    if (this.originalRequestClose) {
      (popup as DialogRequestCloseMethod).requestClose = this.originalRequestClose;
    }

    this.originalClose = null;
    this.originalRequestClose = null;
    this.originalShow = null;
    this.originalShowModal = null;
  }

  private syncNestedState() {
    setBooleanAttribute(
      this,
      "data-nested",
      this.parentElement?.closest(SNYT_DIALOG_ROOT_TAG_NAME) !== null,
    );
  }

  private updateParentDialogState() {
    const parent = this.parentElement?.closest(
      SNYT_DIALOG_ROOT_TAG_NAME,
    ) as SnytDialogRootElement | null;

    if (!parent) {
      return;
    }

    const hasOpenChild = Array.from(
      parent.querySelectorAll<SnytDialogRootElement>(SNYT_DIALOG_ROOT_TAG_NAME),
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

    if (this.popupElement) {
      const stateTargets = getDialogStateElements({
        backdropElements: this.backdropElements,
        panelElement: this.panelElement,
        popupElement: this.popupElement,
      });

      for (const element of stateTargets) {
        setDialogStateAttributes(element, open, modal);
      }
    }

    for (const command of this.commandElements) {
      setStringAttribute(command, "aria-expanded", String(open));
    }
  }
}

function isCommandAction(command: string | undefined): command is CommandAction {
  return command === "close" || command === "request-close" || command === "show-modal";
}

export function defineSnytDialog(
  registry: CustomElementRegistry | undefined = globalThis.customElements,
) {
  defineElement(SNYT_DIALOG_PANEL_TAG_NAME, SnytDialogPanelElement, registry);
  defineElement(SNYT_DIALOG_BACKDROP_TAG_NAME, SnytDialogBackdropElement, registry);
  return defineElement(SNYT_DIALOG_ROOT_TAG_NAME, SnytDialogRootElement, registry);
}
