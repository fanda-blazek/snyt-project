import { isBrowser } from "./dom.ts";
import { isIOS, isWebKit } from "./platform.ts";

interface ScrollLockSnapshot {
  bodyLeft: string;
  bodyOverflow: string;
  bodyPaddingRight: string;
  bodyPosition: string;
  bodyTop: string;
  bodyWidth: string;
  htmlOverflow: string;
  scrollX: number;
  scrollY: number;
}

const owners = new Set<object>();
let snapshot: ScrollLockSnapshot | null = null;

function getScrollbarWidth() {
  if (!isBrowser()) {
    return 0;
  }

  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

function getCurrentScrollPosition() {
  return {
    scrollX: window.pageXOffset || document.documentElement.scrollLeft,
    scrollY: window.pageYOffset || document.documentElement.scrollTop,
  };
}

function createSnapshot(): ScrollLockSnapshot {
  const body = document.body;
  const html = document.documentElement;
  const scroll = getCurrentScrollPosition();

  return {
    ...scroll,
    bodyLeft: body.style.left,
    bodyOverflow: body.style.overflow,
    bodyPaddingRight: body.style.paddingRight,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyWidth: body.style.width,
    htmlOverflow: html.style.overflow,
  };
}

function applyScrollLock(nextSnapshot: ScrollLockSnapshot) {
  const body = document.body;
  const html = document.documentElement;
  const scrollbarWidth = getScrollbarWidth();

  if (scrollbarWidth > 0) {
    const currentPaddingRight = getComputedStyle(body).paddingRight || "0px";
    body.style.paddingRight = `calc(${currentPaddingRight} + ${scrollbarWidth}px)`;
  }

  body.style.overflow = "hidden";
  html.style.overflow = "hidden";

  if (isIOS()) {
    body.style.position = "fixed";
    body.style.top = `-${nextSnapshot.scrollY}px`;
    body.style.left = `-${nextSnapshot.scrollX}px`;
    body.style.width = "100%";
  }
}

function restoreScrollLock(previousSnapshot: ScrollLockSnapshot) {
  const body = document.body;
  const html = document.documentElement;

  body.style.left = previousSnapshot.bodyLeft;
  body.style.overflow = previousSnapshot.bodyOverflow;
  body.style.paddingRight = previousSnapshot.bodyPaddingRight;
  body.style.position = previousSnapshot.bodyPosition;
  body.style.top = previousSnapshot.bodyTop;
  body.style.width = previousSnapshot.bodyWidth;
  html.style.overflow = previousSnapshot.htmlOverflow;

  window.scrollTo(previousSnapshot.scrollX, previousSnapshot.scrollY);
}

export function lockScroll(owner: object) {
  if (!isBrowser() || owners.has(owner)) {
    return () => unlockScroll(owner);
  }

  if (isWebKit() && window.visualViewport && window.visualViewport.scale !== 1) {
    return () => undefined;
  }

  if (owners.size === 0) {
    snapshot = createSnapshot();
    applyScrollLock(snapshot);
  }

  owners.add(owner);

  return () => unlockScroll(owner);
}

export function unlockScroll(owner: object) {
  if (!owners.delete(owner) || owners.size > 0 || !snapshot || !isBrowser()) {
    return;
  }

  restoreScrollLock(snapshot);
  snapshot = null;
}

export function isScrollLocked() {
  return owners.size > 0;
}

export function resetScrollLock() {
  owners.clear();

  if (snapshot && isBrowser()) {
    restoreScrollLock(snapshot);
  }

  snapshot = null;
}

export const scrollLock = {
  isLocked: isScrollLocked,
  lock: lockScroll,
  reset: resetScrollLock,
  unlock: unlockScroll,
};
