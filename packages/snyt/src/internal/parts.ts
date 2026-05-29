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
