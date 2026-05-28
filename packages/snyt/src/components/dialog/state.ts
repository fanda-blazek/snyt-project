import { setBooleanAttribute, setStringAttribute } from "../../internal/attributes.ts";
import { SNYT_DIALOG_TRIGGER_ATTRIBUTE } from "./constants.ts";

export function isDefaultTrueAttributeEnabled(element: Element, name: string) {
  const value = element.getAttribute(name);

  return value === null || value !== "false";
}

export function getDialogTriggerMode(trigger: HTMLElement) {
  const value = trigger.getAttribute(SNYT_DIALOG_TRIGGER_ATTRIBUTE);

  return value === "show" || value === "non-modal" ? "show" : "show-modal";
}

export function setDialogStateAttributes(element: Element, open: boolean, modal: boolean) {
  setBooleanAttribute(element, "data-open", open);
  setBooleanAttribute(element, "data-closed", !open);
  setBooleanAttribute(element, "data-modal", open && modal);
  setStringAttribute(element, "data-state", open ? "open" : "closed");
}
