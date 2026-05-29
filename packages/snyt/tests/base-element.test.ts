import { expect, test } from "vite-plus/test";
import { SnytElement } from "../src/internal/base-element.ts";

class TestSnytElement extends SnytElement {
  private attributeStore = new Map<string, string>();

  attributeChanges: Array<{
    name: string;
    newValue: string | null;
    oldValue: string | null;
  }> = [];
  mountSignals: AbortSignal[] = [];
  signalAbortCount = 0;
  unmountCount = 0;

  override getAttribute(name: string) {
    return this.attributeStore.get(name) ?? null;
  }

  override hasAttribute(name: string) {
    return this.attributeStore.has(name);
  }

  override removeAttribute(name: string) {
    const oldValue = this.getAttribute(name);

    this.attributeStore.delete(name);
    this.attributeChangedCallback(name, oldValue, null);
  }

  override setAttribute(name: string, value: string) {
    const oldValue = this.getAttribute(name);

    this.attributeStore.set(name, value);
    this.attributeChangedCallback(name, oldValue, value);
  }

  override toggleAttribute(name: string, force?: boolean) {
    const nextPresent = force ?? !this.hasAttribute(name);

    if (nextPresent) {
      this.setAttribute(name, "");
    } else {
      this.removeAttribute(name);
    }

    return nextPresent;
  }

  syncAttributeSilently(name: string, value: string) {
    this.setAttributeSilently(name, value);
  }

  protected override mount(signal: AbortSignal) {
    this.mountSignals.push(signal);
    signal.addEventListener("abort", () => {
      this.signalAbortCount += 1;
    });
  }

  protected override unmount() {
    this.unmountCount += 1;
  }

  protected override onAttributeChange(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    this.attributeChanges.push({ name, newValue, oldValue });
  }
}

function createTestElement() {
  return new TestSnytElement();
}

async function flushMicrotasks() {
  await Promise.resolve();
}

test("mounts after a microtask and aborts listeners on disconnect", async () => {
  const element = createTestElement();

  element.connectedCallback();

  expect(element.mountSignals).toHaveLength(0);

  await flushMicrotasks();

  expect(element.mountSignals).toHaveLength(1);
  expect(element.mountSignals[0]!.aborted).toBe(false);

  element.disconnectedCallback();

  expect(element.mountSignals[0]!.aborted).toBe(true);
  expect(element.signalAbortCount).toBe(1);
  expect(element.unmountCount).toBe(1);
});

test("remounts with a fresh signal after reconnect", async () => {
  const element = createTestElement();

  element.connectedCallback();
  await flushMicrotasks();
  element.disconnectedCallback();
  element.connectedCallback();
  await flushMicrotasks();

  expect(element.mountSignals).toHaveLength(2);
  expect(element.mountSignals[0]).not.toBe(element.mountSignals[1]);
  expect(element.mountSignals[0]!.aborted).toBe(true);
  expect(element.mountSignals[1]!.aborted).toBe(false);
});

test("ignores attribute changes before mount and during silent sync", async () => {
  const element = createTestElement();

  element.setAttribute("data-state", "before");
  element.connectedCallback();
  await flushMicrotasks();

  expect(element.attributeChanges).toEqual([]);

  element.setAttribute("data-state", "after");

  expect(element.attributeChanges).toEqual([
    {
      name: "data-state",
      newValue: "after",
      oldValue: "before",
    },
  ]);

  element.syncAttributeSilently("data-state", "silent");

  expect(element.getAttribute("data-state")).toBe("silent");
  expect(element.attributeChanges).toHaveLength(1);
});
