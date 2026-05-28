import { ensureElementId } from "./id.ts";

export type SnytPopoverMode = "auto" | "hint" | "manual";
export type SnytPopoverTargetAction = "hide" | "show" | "toggle";

type PopoverHTMLElement = HTMLElement & {
  hidePopover?: () => void;
  showPopover?: (options?: { source?: HTMLElement }) => void;
  togglePopover?: (options?: boolean | { force?: boolean; source?: HTMLElement }) => boolean;
};

function getHTMLElementPrototype() {
  return globalThis.HTMLElement?.prototype as PopoverHTMLElement | undefined;
}

export function supportsPopoverApi() {
  const prototype = getHTMLElementPrototype();

  return (
    prototype !== undefined &&
    "popover" in prototype &&
    typeof prototype.showPopover === "function" &&
    typeof prototype.hidePopover === "function" &&
    typeof prototype.togglePopover === "function"
  );
}

export function setPopoverMode(element: HTMLElement, mode: SnytPopoverMode | null) {
  if (mode === null) {
    element.removeAttribute("popover");
    return;
  }

  element.setAttribute("popover", mode);
}

export function getPopoverMode(element: HTMLElement) {
  const mode = element.getAttribute("popover");

  if (mode === "hint" || mode === "manual") {
    return mode;
  }

  return element.hasAttribute("popover") ? "auto" : null;
}

export function isPopoverOpen(element: HTMLElement) {
  if (!supportsPopoverApi()) {
    return false;
  }

  try {
    return element.matches(":popover-open");
  } catch {
    return false;
  }
}

export function showPopover(element: HTMLElement, source?: HTMLElement) {
  const popover = element as PopoverHTMLElement;

  if (!supportsPopoverApi() || isPopoverOpen(element)) {
    return isPopoverOpen(element);
  }

  try {
    popover.showPopover?.(source ? { source } : undefined);
    return true;
  } catch {
    return false;
  }
}

export function hidePopover(element: HTMLElement) {
  const popover = element as PopoverHTMLElement;

  if (!supportsPopoverApi() || !isPopoverOpen(element)) {
    return false;
  }

  try {
    popover.hidePopover?.();
    return true;
  } catch {
    return false;
  }
}

export function togglePopover(element: HTMLElement, force?: boolean, source?: HTMLElement) {
  const popover = element as PopoverHTMLElement;

  if (!supportsPopoverApi()) {
    return false;
  }

  try {
    const options = source && force !== undefined ? { force, source } : source ? { source } : force;
    const result = popover.togglePopover?.(options);

    return result ?? isPopoverOpen(element);
  } catch {
    return isPopoverOpen(element);
  }
}

export function setPopoverTrigger(
  trigger: HTMLElement,
  popover: HTMLElement,
  action: SnytPopoverTargetAction = "toggle",
) {
  const id = ensureElementId(popover, "snyt-popover");

  if (globalThis.HTMLButtonElement && trigger instanceof HTMLButtonElement) {
    trigger.type ||= "button";
  }

  trigger.setAttribute("popovertarget", id);
  trigger.setAttribute("popovertargetaction", action);

  return id;
}

export function clearPopoverTrigger(trigger: HTMLElement) {
  trigger.removeAttribute("popovertarget");
  trigger.removeAttribute("popovertargetaction");
}
