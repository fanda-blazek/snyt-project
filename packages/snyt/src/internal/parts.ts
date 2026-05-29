export function queryOptionalPart<TElement extends Element>(root: ParentNode, selector: string) {
  return root.querySelector<TElement>(selector);
}

export function queryRequiredPart<TElement extends Element>(
  root: ParentNode,
  selector: string,
  message: string,
) {
  const element = queryOptionalPart<TElement>(root, selector);

  if (!element) {
    throw new Error(message);
  }

  return element;
}

export function isScopedPart(element: Element, root: Element, rootSelector: string) {
  return element.closest(rootSelector) === root;
}

export function queryScopedParts<TElement extends Element>(
  root: Element,
  selector: string,
  rootSelector: string,
) {
  return Array.from(root.querySelectorAll<TElement>(selector)).filter((element) =>
    isScopedPart(element, root, rootSelector),
  );
}

export function queryOptionalScopedPart<TElement extends Element>(
  root: Element,
  selector: string,
  rootSelector: string,
) {
  return queryScopedParts<TElement>(root, selector, rootSelector)[0] ?? null;
}

export function queryRequiredScopedPart<TElement extends Element>(
  root: Element,
  selector: string,
  rootSelector: string,
  message: string,
) {
  const element = queryOptionalScopedPart<TElement>(root, selector, rootSelector);

  if (!element) {
    throw new Error(message);
  }

  return element;
}

export function setAuthorButtonType(button: HTMLButtonElement) {
  if (!button.hasAttribute("type")) {
    button.type = "button";
  }
}
