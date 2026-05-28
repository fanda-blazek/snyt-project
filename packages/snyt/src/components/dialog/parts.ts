import { setBooleanAttribute, setStringAttribute } from "../../internal/attributes.ts";
import { ensureElementId } from "../../internal/id.ts";
import {
  SNYT_DIALOG_BACKDROP_ATTRIBUTE,
  SNYT_DIALOG_CLOSE_ATTRIBUTE,
  SNYT_DIALOG_DESCRIPTION_ATTRIBUTE,
  SNYT_DIALOG_PANEL_ATTRIBUTE,
  SNYT_DIALOG_POPUP_ATTRIBUTE,
  SNYT_DIALOG_TAG_NAME,
  SNYT_DIALOG_TITLE_ATTRIBUTE,
  SNYT_DIALOG_TRIGGER_ATTRIBUTE,
  SNYT_DIALOG_VIEWPORT_ATTRIBUTE,
} from "./constants.ts";

export interface SnytDialogParts {
  closeElements: HTMLElement[];
  descriptionElement: HTMLElement | null;
  panelElement: HTMLElement | null;
  popupElement: HTMLDialogElement | null;
  titleElement: HTMLElement | null;
  triggerElements: HTMLElement[];
}

export function getClosestDialog(element: Element) {
  return element.closest(SNYT_DIALOG_TAG_NAME) as Element | null;
}

function queryOwnDialogElements(root: HTMLElement, attribute: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(`[${attribute}]`)).filter(
    (element) => getClosestDialog(element) === root,
  );
}

export function queryDialogParts(root: HTMLElement): SnytDialogParts {
  const popupElement =
    root.querySelector<HTMLDialogElement>(`dialog[${SNYT_DIALOG_POPUP_ATTRIBUTE}]`) ??
    root.querySelector("dialog");

  return {
    closeElements: queryOwnDialogElements(root, SNYT_DIALOG_CLOSE_ATTRIBUTE),
    descriptionElement:
      popupElement?.querySelector<HTMLElement>(`[${SNYT_DIALOG_DESCRIPTION_ATTRIBUTE}]`) ?? null,
    panelElement:
      popupElement?.querySelector<HTMLElement>(`[${SNYT_DIALOG_PANEL_ATTRIBUTE}]`) ?? null,
    popupElement,
    titleElement:
      popupElement?.querySelector<HTMLElement>(`[${SNYT_DIALOG_TITLE_ATTRIBUTE}]`) ?? null,
    triggerElements: queryOwnDialogElements(root, SNYT_DIALOG_TRIGGER_ATTRIBUTE),
  };
}

export function queryDialogStateElements(
  root: HTMLElement,
  popupElement: HTMLDialogElement | null,
  panelElement: HTMLElement | null,
) {
  return [
    popupElement,
    panelElement,
    ...Array.from(root.querySelectorAll<HTMLElement>(`[${SNYT_DIALOG_VIEWPORT_ATTRIBUTE}]`)),
    ...Array.from(root.querySelectorAll<HTMLElement>(`[${SNYT_DIALOG_BACKDROP_ATTRIBUTE}]`)),
  ].filter((element): element is HTMLElement => element !== null);
}

export function syncDialogAccessibilityAttributes({
  closeElements,
  descriptionElement,
  disabled,
  open,
  popupElement,
  titleElement,
  triggerElements,
}: SnytDialogParts & {
  disabled: boolean;
  open: boolean;
}) {
  if (!popupElement) {
    return;
  }

  const popupId = ensureElementId(popupElement, "snyt-dialog-popup");

  for (const trigger of triggerElements) {
    if (trigger instanceof HTMLButtonElement) {
      trigger.type ||= "button";
      trigger.disabled = disabled;
    }

    setStringAttribute(trigger, "aria-haspopup", "dialog");
    setStringAttribute(trigger, "aria-expanded", String(open));
    setStringAttribute(trigger, "aria-controls", popupId);
    setBooleanAttribute(trigger, "data-disabled", disabled);
  }

  for (const close of closeElements) {
    if (close instanceof HTMLButtonElement) {
      close.type ||= "button";
    }
  }

  if (titleElement) {
    setStringAttribute(
      popupElement,
      "aria-labelledby",
      ensureElementId(titleElement, "snyt-dialog-title"),
    );
  } else {
    popupElement.removeAttribute("aria-labelledby");
  }

  if (descriptionElement) {
    setStringAttribute(
      popupElement,
      "aria-describedby",
      ensureElementId(descriptionElement, "snyt-dialog-description"),
    );
  } else {
    popupElement.removeAttribute("aria-describedby");
  }
}
