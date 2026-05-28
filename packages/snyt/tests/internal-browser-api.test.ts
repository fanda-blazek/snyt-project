import { expect, test } from "vite-plus/test";
import {
  applyAnchorPosition,
  clearAnchorPosition,
  createAnchorName,
  supportsAnchorScope,
  supportsAnchorPositioning,
} from "../src/internal/anchor-position.ts";
import {
  clearPopoverTrigger,
  getPopoverMode,
  setPopoverMode,
  setPopoverTrigger,
  supportsPopoverApi,
} from "../src/internal/native-popover.ts";

class TestStyle {
  private values = new Map<string, string>();

  getPropertyValue(property: string) {
    return this.values.get(property) ?? "";
  }

  removeProperty(property: string) {
    const previous = this.getPropertyValue(property);

    this.values.delete(property);
    return previous;
  }

  setProperty(property: string, value: string) {
    this.values.set(property, value);
  }
}

class TestElement {
  id = "";
  style = new TestStyle() as unknown as CSSStyleDeclaration;

  private attributes = new Map<string, string>();

  getAttribute(name: string) {
    return this.attributes.get(name) ?? null;
  }

  hasAttribute(name: string) {
    return this.attributes.has(name);
  }

  removeAttribute(name: string) {
    this.attributes.delete(name);
  }

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }
}

function createTestElement() {
  return new TestElement() as unknown as HTMLElement;
}

test("native popover helpers set mode and trigger attributes", () => {
  const trigger = createTestElement();
  const popover = createTestElement();

  setPopoverMode(popover, "manual");
  expect(getPopoverMode(popover)).toBe("manual");

  const id = setPopoverTrigger(trigger, popover, "show");

  expect(id).toMatch(/^snyt-popover-\d+$/);
  expect(popover.id).toBe(id);
  expect(trigger.getAttribute("popovertarget")).toBe(id);
  expect(trigger.getAttribute("popovertargetaction")).toBe("show");

  clearPopoverTrigger(trigger);

  expect(trigger.getAttribute("popovertarget")).toBe(null);
  expect(trigger.getAttribute("popovertargetaction")).toBe(null);
});

test("native popover support detection is SSR-safe", () => {
  expect(supportsPopoverApi()).toBe(false);
});

test("anchor positioning helpers create dashed identifiers and are SSR-safe", () => {
  expect(createAnchorName()).toMatch(/^--snyt-anchor-\d+$/);
  expect(supportsAnchorScope()).toBe(false);
  expect(supportsAnchorPositioning()).toBe(false);
});

test("anchor positioning cleanup restores previous inline styles", () => {
  const anchor = createTestElement();
  const target = createTestElement();

  anchor.style.setProperty("anchor-name", "--existing-anchor");
  target.style.setProperty("position", "fixed");

  const result = applyAnchorPosition(anchor, target, {
    anchorName: "--next-anchor",
    area: "top",
  });

  expect(result.supported).toBe(false);

  result.cleanup();

  expect(anchor.style.getPropertyValue("anchor-name")).toBe("--existing-anchor");
  expect(target.style.getPropertyValue("position")).toBe("fixed");
});

test("anchor positioning clear removes anchor-specific styles only", () => {
  const anchor = createTestElement();
  const target = createTestElement();

  anchor.style.setProperty("anchor-name", "--existing-anchor");
  anchor.style.setProperty("anchor-scope", "--existing-anchor");
  target.style.setProperty("position", "fixed");
  target.style.setProperty("position-anchor", "--existing-anchor");
  target.style.setProperty("position-area", "bottom");

  clearAnchorPosition(anchor, target);

  expect(anchor.style.getPropertyValue("anchor-name")).toBe("");
  expect(anchor.style.getPropertyValue("anchor-scope")).toBe("");
  expect(target.style.getPropertyValue("position")).toBe("fixed");
  expect(target.style.getPropertyValue("position-anchor")).toBe("");
  expect(target.style.getPropertyValue("position-area")).toBe("");
});
