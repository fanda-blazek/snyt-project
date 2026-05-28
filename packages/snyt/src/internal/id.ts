let idCounter = 0;

export function createSnytId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function ensureElementId(element: HTMLElement, prefix: string) {
  if (!element.id) {
    element.id = createSnytId(prefix);
  }

  return element.id;
}
