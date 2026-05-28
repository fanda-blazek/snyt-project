import { getNavigator, isBrowser } from "./dom.ts";

function matchPlatform(pattern: RegExp) {
  const navigator = getNavigator();

  if (!navigator) {
    return false;
  }

  const userAgentData = (
    navigator as Navigator & {
      userAgentData?: {
        platform?: string;
      };
    }
  ).userAgentData;

  if (userAgentData?.platform) {
    return pattern.test(userAgentData.platform);
  }

  return pattern.test(navigator.platform);
}

export function isMacOS() {
  return matchPlatform(/^Mac/i);
}

export function isIPhone() {
  return matchPlatform(/^iPhone/i);
}

export function isIPad() {
  const navigator = getNavigator();

  return (
    matchPlatform(/^iPad/i) || (isMacOS() && navigator !== null && navigator.maxTouchPoints > 1)
  );
}

export function isIOS() {
  return isIPhone() || isIPad();
}

export function isWebKit() {
  if (!isBrowser()) {
    return false;
  }

  return "WebkitAppearance" in document.documentElement.style;
}
