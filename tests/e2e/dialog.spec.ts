import { expect, test, type Page } from "@playwright/test";

declare global {
  interface Window {
    __snytDialogCancelEvents: Array<{
      reason: string;
      trigger: string | null;
    }>;
    __snytDialogChangeEvents: Array<{
      modal: boolean;
      open: boolean;
      reason: string;
      trigger: string | null;
    }>;
  }
}

async function mountDialog(page: Page, attributes = "") {
  await page.evaluate((dialogAttributes) => {
    document.body.innerHTML = `
      <main style="min-height: 2200px; padding: 40px;">
        <snyt-dialog id="case" ${dialogAttributes}>
          <button id="open" type="button" data-snyt-dialog-trigger>Open</button>
          <dialog data-snyt-dialog-popup style="width: 320px; border: 0; padding: 0;">
            <div data-snyt-dialog-panel style="padding: 20px; background: white; color: black;">
              <h2 id="title" data-snyt-dialog-title>Dialog title</h2>
              <p id="description" data-snyt-dialog-description>Dialog description.</p>
              <button id="close" type="button" data-snyt-dialog-close>Close</button>
            </div>
          </dialog>
        </snyt-dialog>
      </main>
    `;

    window.__snytDialogCancelEvents = [];
    window.__snytDialogChangeEvents = [];

    document.querySelector("snyt-dialog")?.addEventListener("snyt-dialog-change", (event) => {
      const detail = (event as CustomEvent).detail;

      window.__snytDialogChangeEvents.push({
        modal: detail.modal,
        open: detail.open,
        reason: detail.reason,
        trigger: detail.trigger instanceof HTMLElement ? detail.trigger.id : null,
      });
    });

    document.querySelector("snyt-dialog")?.addEventListener("snyt-dialog-cancel", (event) => {
      const detail = (event as CustomEvent).detail;

      window.__snytDialogCancelEvents.push({
        reason: detail.reason,
        trigger: detail.trigger instanceof HTMLElement ? detail.trigger.id : null,
      });
    });
  }, attributes);
}

test("snyt-dialog opens modal dialogs and wires state, aria, events, and scroll lock", async ({
  page,
}) => {
  await page.goto("/");
  await mountDialog(page);

  const dialog = page.locator("snyt-dialog#case");
  const trigger = page.locator("#open");
  const popup = page.locator("dialog[data-snyt-dialog-popup]");
  const title = page.locator("#title");
  const description = page.locator("#description");

  await expect(dialog).toHaveAttribute("data-state", "closed");
  await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();

  await expect(dialog).toHaveAttribute("open", "");
  await expect(dialog).toHaveAttribute("data-state", "open");
  await expect(dialog).toHaveAttribute("data-modal", "");
  await expect(popup).toHaveAttribute("open", "");
  await expect(popup).toHaveAttribute("data-state", "open");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger).toHaveAttribute("aria-controls", /.+/);

  const titleId = await title.getAttribute("id");
  const descriptionId = await description.getAttribute("id");

  expect(titleId).toBeTruthy();
  expect(descriptionId).toBeTruthy();
  await expect(popup).toHaveAttribute("aria-labelledby", titleId!);
  await expect(popup).toHaveAttribute("aria-describedby", descriptionId!);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.overflow))
    .toBe("hidden");

  await page.locator("#close").click();

  await expect(dialog).not.toHaveAttribute("open");
  await expect(dialog).toHaveAttribute("data-state", "closed");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  await expect
    .poll(() => page.evaluate(() => window.__snytDialogChangeEvents))
    .toEqual([
      { modal: true, open: true, reason: "trigger", trigger: "open" },
      { modal: true, open: false, reason: "close", trigger: "close" },
    ]);
});

test("snyt-dialog supports light dismiss and cancel prevention", async ({ page }) => {
  await page.goto("/");
  await mountDialog(page);

  await page.locator("#open").click();
  await page.mouse.click(10, 10);

  await expect(page.locator("snyt-dialog#case")).not.toHaveAttribute("open");
  await expect
    .poll(() => page.evaluate(() => window.__snytDialogCancelEvents))
    .toEqual([{ reason: "light-dismiss", trigger: null }]);

  await mountDialog(page, 'dismissible="false"');
  await page.locator("#open").click();
  await page.keyboard.press("Escape");

  await expect(page.locator("snyt-dialog#case")).toHaveAttribute("open", "");

  await page.mouse.click(10, 10);

  await expect(page.locator("snyt-dialog#case")).toHaveAttribute("open", "");
  await expect
    .poll(() => page.evaluate(() => window.__snytDialogCancelEvents))
    .toEqual([
      { reason: "cancel", trigger: null },
      { reason: "light-dismiss", trigger: null },
    ]);

  await page.locator("#close").click();
  await expect(page.locator("snyt-dialog#case")).not.toHaveAttribute("open");
});

test("snyt-dialog keeps scroll locked while nested modal dialogs are open", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    document.body.innerHTML = `
      <main style="min-height: 2200px; padding: 40px;">
        <snyt-dialog id="parent">
          <button id="parent-open" type="button" data-snyt-dialog-trigger>Open parent</button>
          <dialog data-snyt-dialog-popup style="width: 360px; border: 0; padding: 0;">
            <div data-snyt-dialog-panel style="padding: 20px; background: white; color: black;">
              <h2 data-snyt-dialog-title>Parent</h2>
              <snyt-dialog id="child">
                <button id="child-open" type="button" data-snyt-dialog-trigger>Open child</button>
                <dialog data-snyt-dialog-popup style="width: 280px; border: 0; padding: 0;">
                  <div data-snyt-dialog-panel style="padding: 20px; background: white; color: black;">
                    <h2 data-snyt-dialog-title>Child</h2>
                    <button id="child-close" type="button" data-snyt-dialog-close>Close child</button>
                  </div>
                </dialog>
              </snyt-dialog>
              <button id="parent-close" type="button" data-snyt-dialog-close>Close parent</button>
            </div>
          </dialog>
        </snyt-dialog>
      </main>
    `;
  });

  await page.locator("#parent-open").click();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.overflow))
    .toBe("hidden");

  await page.locator("#child-open").click();
  await expect(page.locator("snyt-dialog#parent")).toHaveAttribute("data-child-dialog-open", "");
  await expect(page.locator("snyt-dialog#child")).toHaveAttribute("data-nested", "");
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.overflow))
    .toBe("hidden");

  await page.locator("#child-close").click();
  await expect(page.locator("snyt-dialog#child")).not.toHaveAttribute("open");
  await expect(page.locator("snyt-dialog#parent")).not.toHaveAttribute("data-child-dialog-open");
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.overflow))
    .toBe("hidden");

  await page.locator("#parent-close").click();
  await expect(page.locator("snyt-dialog#parent")).not.toHaveAttribute("open");
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe("");
});
