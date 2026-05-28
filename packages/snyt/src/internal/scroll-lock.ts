import { isBrowser } from "./dom.ts";

const SCROLL_LOCK_ATTRIBUTE = "data-snyt-scroll-locked";
const SCROLLBAR_WIDTH_PROPERTY = "--snyt-scrollbar-width";

interface ScrollLockOptions {
  referenceElement?: Element | null;
}

interface ScrollLockSnapshot {
  bodyLeft: string;
  bodyOverflow: string;
  bodyOverflowX: string;
  bodyOverflowY: string;
  bodyPosition: string;
  bodyScrollBehavior: string;
  bodyTop: string;
  bodyWidth: string;
  hadScrollLockAttribute: boolean;
  htmlOverflow: string;
  htmlOverflowX: string;
  htmlOverflowY: string;
  htmlPaddingInlineEnd: string;
  htmlScrollbarGutter: string;
  htmlScrollBehavior: string;
  scrollbarWidthProperty: string;
  scrollX: number;
  scrollY: number;
}

interface ScrollLockState {
  document: Document;
  owners: Set<object>;
  snapshot: ScrollLockSnapshot | null;
}

const documentStates = new WeakMap<Document, ScrollLockState>();
const ownerStates = new WeakMap<object, ScrollLockState>();
const states = new Set<ScrollLockState>();

function getOwnerDocument(referenceElement?: Element | null) {
  if (referenceElement?.ownerDocument) {
    return referenceElement.ownerDocument;
  }

  return isBrowser() ? document : null;
}

function getOwnerWindow(document: Document) {
  return document.defaultView ?? (isBrowser() ? window : null);
}

function getState(document: Document) {
  const currentState = documentStates.get(document);

  if (currentState) {
    return currentState;
  }

  const nextState: ScrollLockState = {
    document,
    owners: new Set(),
    snapshot: null,
  };

  documentStates.set(document, nextState);
  states.add(nextState);

  return nextState;
}

function supportsStableScrollbarGutter(window: Window) {
  const css = (window as Window & { CSS?: typeof CSS }).CSS;

  return css?.supports?.("scrollbar-gutter", "stable") ?? false;
}

function isIOS(window: Window) {
  const { navigator } = window;

  return (
    /^iPhone/i.test(navigator.platform) ||
    /^iPad/i.test(navigator.platform) ||
    (/^Mac/i.test(navigator.platform) && navigator.maxTouchPoints > 1)
  );
}

function isWebKit(document: Document) {
  return "WebkitAppearance" in document.documentElement.style;
}

function getScrollbarWidth(document: Document, window: Window) {
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

function getCurrentScrollPosition(document: Document, window: Window) {
  return {
    scrollX: window.pageXOffset || document.documentElement.scrollLeft,
    scrollY: window.pageYOffset || document.documentElement.scrollTop,
  };
}

function createSnapshot(document: Document, window: Window): ScrollLockSnapshot {
  const body = document.body;
  const html = document.documentElement;
  const scroll = getCurrentScrollPosition(document, window);

  return {
    ...scroll,
    bodyLeft: body.style.left,
    bodyOverflow: body.style.overflow,
    bodyOverflowX: body.style.overflowX,
    bodyOverflowY: body.style.overflowY,
    bodyPosition: body.style.position,
    bodyScrollBehavior: body.style.scrollBehavior,
    bodyTop: body.style.top,
    bodyWidth: body.style.width,
    hadScrollLockAttribute: html.hasAttribute(SCROLL_LOCK_ATTRIBUTE),
    htmlOverflow: html.style.overflow,
    htmlOverflowX: html.style.overflowX,
    htmlOverflowY: html.style.overflowY,
    htmlPaddingInlineEnd: html.style.paddingInlineEnd,
    htmlScrollbarGutter: html.style.scrollbarGutter,
    htmlScrollBehavior: html.style.scrollBehavior,
    scrollbarWidthProperty: html.style.getPropertyValue(SCROLLBAR_WIDTH_PROPERTY),
  };
}

function applyScrollLock(document: Document, window: Window, snapshot: ScrollLockSnapshot) {
  const body = document.body;
  const html = document.documentElement;
  const scrollbarWidth = getScrollbarWidth(document, window);

  html.setAttribute(SCROLL_LOCK_ATTRIBUTE, "");
  html.style.setProperty(SCROLLBAR_WIDTH_PROPERTY, `${scrollbarWidth}px`);
  html.style.overflow = "hidden";
  html.style.scrollBehavior = "auto";
  body.style.overflow = "hidden";
  body.style.scrollBehavior = "auto";

  if (scrollbarWidth > 0) {
    if (supportsStableScrollbarGutter(window)) {
      const gutter = window.getComputedStyle(html).scrollbarGutter.includes("both-edges")
        ? "stable both-edges"
        : "stable";

      html.style.scrollbarGutter = gutter;
    } else {
      const currentPaddingInlineEnd = window.getComputedStyle(html).paddingInlineEnd || "0px";

      html.style.paddingInlineEnd = `calc(${currentPaddingInlineEnd} + ${scrollbarWidth}px)`;
    }
  }

  if (isIOS(window)) {
    body.style.position = "fixed";
    body.style.top = `-${snapshot.scrollY}px`;
    body.style.left = `-${snapshot.scrollX}px`;
    body.style.width = "100%";
  }
}

function restoreScrollLock(document: Document, window: Window, snapshot: ScrollLockSnapshot) {
  const body = document.body;
  const html = document.documentElement;

  body.style.left = snapshot.bodyLeft;
  body.style.overflow = snapshot.bodyOverflow;
  body.style.overflowX = snapshot.bodyOverflowX;
  body.style.overflowY = snapshot.bodyOverflowY;
  body.style.position = snapshot.bodyPosition;
  body.style.top = snapshot.bodyTop;
  body.style.width = snapshot.bodyWidth;
  html.style.overflow = snapshot.htmlOverflow;
  html.style.overflowX = snapshot.htmlOverflowX;
  html.style.overflowY = snapshot.htmlOverflowY;
  html.style.paddingInlineEnd = snapshot.htmlPaddingInlineEnd;
  html.style.scrollbarGutter = snapshot.htmlScrollbarGutter;

  if (snapshot.scrollbarWidthProperty) {
    html.style.setProperty(SCROLLBAR_WIDTH_PROPERTY, snapshot.scrollbarWidthProperty);
  } else {
    html.style.removeProperty(SCROLLBAR_WIDTH_PROPERTY);
  }

  if (!snapshot.hadScrollLockAttribute) {
    html.removeAttribute(SCROLL_LOCK_ATTRIBUTE);
  }

  html.style.scrollBehavior = "auto";
  body.style.scrollBehavior = "auto";
  window.scrollTo(snapshot.scrollX, snapshot.scrollY);
  html.style.scrollBehavior = snapshot.htmlScrollBehavior;
  body.style.scrollBehavior = snapshot.bodyScrollBehavior;
}

function releaseState(state: ScrollLockState) {
  const window = getOwnerWindow(state.document);

  if (window && state.snapshot) {
    restoreScrollLock(state.document, window, state.snapshot);
  }

  state.snapshot = null;
  documentStates.delete(state.document);
  states.delete(state);
}

function findStateForOwner(owner: object) {
  const ownerState = ownerStates.get(owner);

  if (ownerState) {
    return ownerState;
  }

  for (const state of states) {
    if (state.owners.has(owner)) {
      return state;
    }
  }

  return null;
}

export function lockScroll(owner: object, options: ScrollLockOptions = {}) {
  const currentState = ownerStates.get(owner);

  if (currentState) {
    return () => unlockScroll(owner);
  }

  const document = getOwnerDocument(options.referenceElement);
  const window = document ? getOwnerWindow(document) : null;

  if (!document || !window) {
    return () => unlockScroll(owner);
  }

  const existingState = documentStates.get(document);

  if (
    !existingState &&
    isWebKit(document) &&
    window.visualViewport &&
    window.visualViewport.scale !== 1
  ) {
    return () => undefined;
  }

  const state = existingState ?? getState(document);

  if (state.owners.size === 0) {
    state.snapshot = createSnapshot(document, window);
    applyScrollLock(document, window, state.snapshot);
  }

  state.owners.add(owner);
  ownerStates.set(owner, state);

  return () => unlockScroll(owner);
}

export function unlockScroll(owner: object, options: ScrollLockOptions = {}) {
  let state = findStateForOwner(owner);

  if (!state && options.referenceElement) {
    const document = getOwnerDocument(options.referenceElement);

    state = document ? (documentStates.get(document) ?? null) : null;
  }

  if (!state || !state.owners.delete(owner)) {
    return;
  }

  ownerStates.delete(owner);

  if (state.owners.size === 0) {
    releaseState(state);
  }
}

export function isScrollLocked(options: ScrollLockOptions = {}) {
  const document = getOwnerDocument(options.referenceElement);

  if (!document) {
    return false;
  }

  return (documentStates.get(document)?.owners.size ?? 0) > 0;
}

export function resetScrollLock(options?: ScrollLockOptions) {
  if (options) {
    const document = getOwnerDocument(options.referenceElement);
    const state = document ? documentStates.get(document) : null;

    if (!state) {
      return;
    }

    for (const owner of state.owners) {
      ownerStates.delete(owner);
    }
    state.owners.clear();
    releaseState(state);
    return;
  }

  for (const state of Array.from(states)) {
    for (const owner of state.owners) {
      ownerStates.delete(owner);
    }
    state.owners.clear();
    releaseState(state);
  }
}

export const scrollLock = {
  isLocked: isScrollLocked,
  lock: lockScroll,
  reset: resetScrollLock,
  unlock: unlockScroll,
};
