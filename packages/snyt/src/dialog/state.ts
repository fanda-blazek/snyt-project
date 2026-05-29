import { setBooleanAttribute, setStringAttribute } from "../internal/attributes.ts";

export function isDefaultTrueAttributeEnabled(element: Element, name: string) {
  const value = element.getAttribute(name);

  return value === null || value !== "false";
}

export function setDialogStateAttributes(element: Element, open: boolean, modal: boolean) {
  setBooleanAttribute(element, "data-open", open);
  setBooleanAttribute(element, "data-closed", !open);
  setBooleanAttribute(element, "data-modal", open && modal);
  setStringAttribute(element, "data-state", open ? "open" : "closed");
}
