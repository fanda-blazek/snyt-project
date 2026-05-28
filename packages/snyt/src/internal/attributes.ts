export function isBooleanAttributePresent(element: Element, name: string) {
  const value = element.getAttribute(name);

  return value !== null && value !== "false";
}

export function setBooleanAttribute(element: Element, name: string, value: boolean) {
  if (value) {
    if (!element.hasAttribute(name)) {
      element.setAttribute(name, "");
    }
    return;
  }

  if (element.hasAttribute(name)) {
    element.removeAttribute(name);
  }
}

export function setStringAttribute(element: Element, name: string, value: string | null) {
  if (value === null) {
    if (element.hasAttribute(name)) {
      element.removeAttribute(name);
    }
    return;
  }

  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
}
