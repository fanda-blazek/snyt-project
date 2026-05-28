import { expect, test } from "@playwright/test";

declare global {
  interface Window {
    __snytToggleEvents: Array<{
      pressed: boolean;
      reason: string;
    }>;
  }
}

test("snyt-toggle syncs trigger state and emits change events", async ({ page }) => {
  await page.goto("/");

  const toggle = page.locator("snyt-toggle");
  const trigger = page.getByRole("button", { name: "Bold" });
  const state = page.locator("#toggle-state");

  await page.evaluate(() => {
    window.__snytToggleEvents = [];

    document.querySelector("snyt-toggle")?.addEventListener("snyt-toggle-change", (event) => {
      const detail = (event as CustomEvent).detail;

      window.__snytToggleEvents.push({
        pressed: detail.pressed,
        reason: detail.reason,
      });
    });
  });

  await expect(toggle).toHaveAttribute("data-state", "unpressed");
  await expect(toggle).not.toHaveAttribute("pressed");
  await expect(trigger).toHaveAttribute("aria-pressed", "false");
  await expect(trigger).not.toHaveAttribute("data-pressed");
  await expect(state).toHaveText("unpressed");

  await trigger.click();

  await expect(toggle).toHaveAttribute("pressed", "");
  await expect(toggle).toHaveAttribute("data-pressed", "");
  await expect(toggle).toHaveAttribute("data-state", "pressed");
  await expect(trigger).toHaveAttribute("aria-pressed", "true");
  await expect(trigger).toHaveAttribute("data-pressed", "");
  await expect(state).toHaveText("pressed");

  await trigger.click();

  await expect(toggle).not.toHaveAttribute("pressed");
  await expect(toggle).not.toHaveAttribute("data-pressed");
  await expect(toggle).toHaveAttribute("data-state", "unpressed");
  await expect(trigger).toHaveAttribute("aria-pressed", "false");
  await expect(trigger).not.toHaveAttribute("data-pressed");
  await expect(state).toHaveText("unpressed");
  await expect
    .poll(() => page.evaluate(() => window.__snytToggleEvents))
    .toEqual([
      { pressed: true, reason: "trigger" },
      { pressed: false, reason: "trigger" },
    ]);
});

test("snyt-toggle exposes imperative state methods", async ({ page }) => {
  await page.goto("/");

  const toggle = page.locator("snyt-toggle");
  const trigger = page.getByRole("button", { name: "Bold" });

  await page.evaluate(() => {
    const toggle = document.querySelector("snyt-toggle") as HTMLElement & {
      press: () => void;
      release: () => void;
      toggle: () => void;
    };

    toggle.press();
  });

  await expect(toggle).toHaveAttribute("pressed", "");
  await expect(trigger).toHaveAttribute("aria-pressed", "true");

  await page.evaluate(() => {
    const toggle = document.querySelector("snyt-toggle") as HTMLElement & {
      release: () => void;
    };

    toggle.release();
  });

  await expect(toggle).not.toHaveAttribute("pressed");
  await expect(trigger).toHaveAttribute("aria-pressed", "false");

  await page.evaluate(() => {
    const toggle = document.querySelector("snyt-toggle") as HTMLElement & {
      toggle: () => void;
    };

    toggle.toggle();
  });

  await expect(toggle).toHaveAttribute("pressed", "");
  await expect(trigger).toHaveAttribute("aria-pressed", "true");
});
