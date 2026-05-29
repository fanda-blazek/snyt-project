import {
  SNYT_DIALOG_BACKDROP_TAG_NAME,
  SNYT_DIALOG_PANEL_TAG_NAME,
  SNYT_DIALOG_ROOT_TAG_NAME,
} from "./constants.ts";

export interface SnytDialogParts {
  backdropElements: HTMLElement[];
  commandElements: HTMLButtonElement[];
  panelElement: HTMLElement | null;
  popupElement: HTMLDialogElement;
}

export function getClosestDialogRoot(element: Element) {
  return element.closest(SNYT_DIALOG_ROOT_TAG_NAME) as Element | null;
}

function queryOwnElements<TElement extends Element>(root: HTMLElement, selector: string) {
  return Array.from(root.querySelectorAll<TElement>(selector)).filter(
    (element) => getClosestDialogRoot(element) === root,
  );
}

export function queryOwnNativeDialogs(root: HTMLElement) {
  return queryOwnElements<HTMLDialogElement>(root, "dialog");
}

export function queryDialogCommandElements(root: HTMLElement, popupElement: HTMLDialogElement) {
  return Array.from(
    root.ownerDocument.querySelectorAll<HTMLButtonElement>("button[commandfor]"),
  ).filter((button) => button.getAttribute("commandfor") === popupElement.id);
}

export function queryDialogParts(root: HTMLElement): SnytDialogParts {
  const popupElements = queryOwnNativeDialogs(root);

  if (popupElements.length !== 1) {
    throw new Error("[SnytDialogRoot] Expected exactly one inner `<dialog>` element.");
  }

  const [popupElement] = popupElements;

  if (!popupElement.id) {
    throw new Error("[SnytDialogRoot] Inner `<dialog>` must have an `id` for `commandfor`.");
  }

  return {
    backdropElements: queryOwnElements<HTMLElement>(root, SNYT_DIALOG_BACKDROP_TAG_NAME),
    commandElements: queryDialogCommandElements(root, popupElement),
    panelElement: queryOwnElements<HTMLElement>(root, SNYT_DIALOG_PANEL_TAG_NAME)[0] ?? null,
    popupElement,
  };
}

export function getDialogStateElements({
  backdropElements,
  panelElement,
  popupElement,
}: Pick<SnytDialogParts, "backdropElements" | "panelElement" | "popupElement">) {
  return [popupElement, panelElement, ...backdropElements].filter(
    (element): element is HTMLElement => element !== null,
  );
}
