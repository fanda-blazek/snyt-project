import {
  isBooleanAttributePresent,
  setBooleanAttribute,
  setStringAttribute,
} from "../internal/attributes.ts";
import { defineElement } from "../internal/define-element.ts";
import { dispatchSnytChangeEvent } from "../internal/events.ts";

export const SNYT_TOGGLE_TAG_NAME = "snyt-toggle";
export const SNYT_TOGGLE_CHANGE_EVENT = "snyt-toggle-change";
export const SNYT_TOGGLE_TRIGGER_ATTRIBUTE = "data-snyt-toggle-trigger";

export type SnytToggleChangeReason = "trigger" | "api";

export interface SnytToggleChangeEventDetail {
  pressed: boolean;
  reason: SnytToggleChangeReason;
  trigger: Element | null;
}

const HTMLElementBase =
  globalThis.HTMLElement ??
  (class {} as {
    new (): HTMLElement;
  });

export class SnytToggleElement extends HTMLElementBase {
  static observedAttributes = ["pressed", "disabled"];

  private triggerElement: HTMLElement | null = null;

  get pressed() {
    return isBooleanAttributePresent(this, "pressed");
  }

  set pressed(value: boolean) {
    this.setPressed(value, "api", null);
  }

  get disabled() {
    return isBooleanAttributePresent(this, "disabled");
  }

  set disabled(value: boolean) {
    setBooleanAttribute(this, "disabled", value);
  }

  connectedCallback() {
    this.setAttribute("data-snyt-component", "toggle");
    this.addEventListener("click", this.handleClick);
    this.syncTrigger();
    this.syncStateAttributes();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
  }

  attributeChangedCallback() {
    this.syncTrigger();
    this.syncStateAttributes();
  }

  toggle() {
    this.setPressed(!this.pressed, "api", null);
  }

  press() {
    this.setPressed(true, "api", null);
  }

  release() {
    this.setPressed(false, "api", null);
  }

  private handleClick = (event: MouseEvent) => {
    if (this.disabled) {
      event.preventDefault();
      return;
    }

    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const trigger = target.closest<HTMLElement>(`[${SNYT_TOGGLE_TRIGGER_ATTRIBUTE}]`);

    if (!trigger || !this.contains(trigger)) {
      return;
    }

    this.setPressed(!this.pressed, "trigger", trigger);
  };

  private setPressed(
    nextPressed: boolean,
    reason: SnytToggleChangeReason,
    trigger: Element | null,
  ) {
    const previousPressed = this.pressed;

    setBooleanAttribute(this, "pressed", nextPressed);
    this.syncStateAttributes();

    if (previousPressed === nextPressed) {
      return;
    }

    dispatchSnytChangeEvent<SnytToggleChangeEventDetail>(this, SNYT_TOGGLE_CHANGE_EVENT, {
      pressed: nextPressed,
      reason,
      trigger,
    });
  }

  private syncTrigger() {
    this.triggerElement = this.querySelector<HTMLElement>(`[${SNYT_TOGGLE_TRIGGER_ATTRIBUTE}]`);

    if (!this.triggerElement) {
      return;
    }

    if (this.triggerElement instanceof HTMLButtonElement) {
      this.triggerElement.type ||= "button";
      this.triggerElement.disabled = this.disabled;
    }

    setStringAttribute(this.triggerElement, "aria-pressed", String(this.pressed));
    setStringAttribute(this.triggerElement, "aria-disabled", this.disabled ? "true" : null);
    setBooleanAttribute(this.triggerElement, "data-pressed", this.pressed);
    setBooleanAttribute(this.triggerElement, "data-disabled", this.disabled);
  }

  private syncStateAttributes() {
    setBooleanAttribute(this, "data-pressed", this.pressed);
    setBooleanAttribute(this, "data-disabled", this.disabled);

    if (this.pressed) {
      this.setAttribute("data-state", "pressed");
    } else {
      this.setAttribute("data-state", "unpressed");
    }

    if (this.triggerElement) {
      setStringAttribute(this.triggerElement, "aria-pressed", String(this.pressed));
      setStringAttribute(this.triggerElement, "aria-disabled", this.disabled ? "true" : null);
      setBooleanAttribute(this.triggerElement, "data-pressed", this.pressed);
      setBooleanAttribute(this.triggerElement, "data-disabled", this.disabled);
    }
  }
}

export function defineSnytToggle(
  registry: CustomElementRegistry | undefined = globalThis.customElements,
) {
  return defineElement(SNYT_TOGGLE_TAG_NAME, SnytToggleElement, registry);
}
