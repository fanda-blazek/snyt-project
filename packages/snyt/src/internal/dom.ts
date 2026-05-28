export function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function getNavigator() {
  return isBrowser() ? window.navigator : null;
}

export function containsPoint(element: Element, clientX: number, clientY: number) {
  const rect = element.getBoundingClientRect();

  return (
    rect.top <= clientY && clientY <= rect.bottom && rect.left <= clientX && clientX <= rect.right
  );
}
