import { createSnytId } from "./id.ts";

export type SnytAnchorName = `--${string}`;
export type SnytAnchorPosition = "absolute" | "fixed";
export type SnytAnchorScope = "all" | "none" | SnytAnchorName;

export interface SnytAnchorPositionOptions {
  anchorName?: SnytAnchorName;
  area?: string;
  position?: SnytAnchorPosition;
  scope?: SnytAnchorScope;
  scopeElement?: HTMLElement;
  tryFallbacks?: string;
  tryOrder?: string;
  visibility?: string;
}

export interface SnytAnchorPositionResult {
  anchorName: SnytAnchorName;
  cleanup: () => void;
  supported: boolean;
}

const anchorProperties = ["anchor-name", "anchor-scope"] as const;
const targetAnchorProperties = [
  "position-anchor",
  "position-area",
  "position-try-fallbacks",
  "position-try-order",
  "position-visibility",
] as const;
const targetSnapshotProperties = [
  "position",
  "position-anchor",
  "position-area",
  "position-try-fallbacks",
  "position-try-order",
  "position-visibility",
] as const;

function supportsCssDeclaration(property: string, value: string) {
  return typeof globalThis.CSS !== "undefined" && CSS.supports(property, value);
}

function readStyleSnapshot(element: HTMLElement, properties: readonly string[]) {
  return new Map(
    properties.map((property) => [property, element.style.getPropertyValue(property)]),
  );
}

function restoreStyleSnapshot(element: HTMLElement, snapshot: Map<string, string>) {
  for (const [property, value] of snapshot) {
    if (value) {
      element.style.setProperty(property, value);
    } else {
      element.style.removeProperty(property);
    }
  }
}

export function createAnchorName(prefix = "snyt-anchor"): SnytAnchorName {
  return `--${createSnytId(prefix).replaceAll(/[^a-zA-Z0-9_-]/g, "-")}`;
}

export function supportsAnchorPositioning() {
  return (
    supportsCssDeclaration("anchor-name", "--snyt-anchor") &&
    supportsCssDeclaration("position-anchor", "--snyt-anchor") &&
    supportsCssDeclaration("position-area", "bottom")
  );
}

export function supportsAnchorScope() {
  return supportsCssDeclaration("anchor-scope", "--snyt-anchor");
}

export function applyAnchorPosition(
  anchor: HTMLElement,
  target: HTMLElement,
  {
    anchorName = createAnchorName(),
    area = "bottom",
    position = "absolute",
    scope,
    scopeElement = anchor.parentElement ?? anchor,
    tryFallbacks = "flip-block, flip-inline, flip-start",
    tryOrder = "most-width",
    visibility,
  }: SnytAnchorPositionOptions = {},
): SnytAnchorPositionResult {
  const supported = supportsAnchorPositioning();
  const anchorSnapshot = readStyleSnapshot(anchor, anchorProperties);
  const scopeSnapshot =
    scopeElement === anchor ? anchorSnapshot : readStyleSnapshot(scopeElement, anchorProperties);
  const targetSnapshot = readStyleSnapshot(target, targetSnapshotProperties);

  if (supported) {
    anchor.style.setProperty("anchor-name", anchorName);

    if (scope && supportsAnchorScope()) {
      scopeElement.style.setProperty("anchor-scope", scope);
    }

    target.style.setProperty("position", position);
    target.style.setProperty("position-anchor", anchorName);
    target.style.setProperty("position-area", area);
    target.style.setProperty("position-try-fallbacks", tryFallbacks);
    target.style.setProperty("position-try-order", tryOrder);

    if (visibility) {
      target.style.setProperty("position-visibility", visibility);
    } else {
      target.style.removeProperty("position-visibility");
    }
  }

  return {
    anchorName,
    cleanup() {
      restoreStyleSnapshot(anchor, anchorSnapshot);
      restoreStyleSnapshot(scopeElement, scopeSnapshot);
      restoreStyleSnapshot(target, targetSnapshot);
    },
    supported,
  };
}

export function clearAnchorPosition(anchor: HTMLElement, target: HTMLElement) {
  for (const property of anchorProperties) {
    anchor.style.removeProperty(property);
  }

  for (const property of targetAnchorProperties) {
    target.style.removeProperty(property);
  }
}
