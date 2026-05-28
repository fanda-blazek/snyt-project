export function isBooleanAttributePresent(element: Element, name: string) {
  const value = element.getAttribute(name);

  return value !== null && value !== "false";
}

export function setBooleanAttribute(element: Element, name: string, value: boolean) {
  if (value) {
    element.setAttribute(name, "");
    return;
  }

  element.removeAttribute(name);
}

export function setStringAttribute(element: Element, name: string, value: string | null) {
  if (value === null) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value);
}
