export interface SnytChangeEventDetail<TReason extends string = string> {
  reason: TReason;
  trigger: Element | null;
}

export function dispatchSnytChangeEvent<TDetail extends SnytChangeEventDetail>(
  element: Element,
  type: string,
  detail: TDetail,
) {
  return element.dispatchEvent(
    new CustomEvent(type, {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail,
    }),
  );
}
