import { expect, test, type Page } from "@playwright/test";

declare global {
  interface Window {
    __snytDialogCancelEvents: number;
    __snytDialogCloseEvents: number;
    __snytDialogOpenEvents: number;
  }
}

async function mountDialog(page: Page, attributes = "") {
  await page.evaluate((dialogAttributes) => {
    document.body.innerHTML = `
      <main style="min-height: 2200px; padding: 40px;">
        <button id="outside-open" type="button" commandfor="case-popup" command="show-modal">
          Open outside
        </button>
        <snyt-dialog-root id="case" ${dialogAttributes}>
          <button id="open" type="button" commandfor="case-popup" command="show-modal">
            Open
          </button>
          <dialog
            id="case-popup"
            aria-labelledby="title"
            aria-describedby="description"
            style="width: 320px; border: 0; padding: 0;"
          >
            <snyt-dialog-backdrop id="backdrop"></snyt-dialog-backdrop>
            <snyt-dialog-panel id="panel" style="display: block; padding: 20px; background: white; color: black;">
              <h2 id="title">Dialog title</h2>
              <p id="description">Dialog description.</p>
              <button id="request-close" type="button" commandfor="case-popup" command="request-close">
                Request close
              </button>
              <button id="close" type="button" commandfor="case-popup" command="close" value="closed">
                Close
              </button>
            </snyt-dialog-panel>
          </dialog>
        </snyt-dialog-root>
      </main>
    `;

    window.__snytDialogCancelEvents = 0;
    window.__snytDialogCloseEvents = 0;
    window.__snytDialogOpenEvents = 0;

    const dialog = document.querySelector("snyt-dialog-root");

    dialog?.addEventListener("open", () => {
      window.__snytDialogOpenEvents += 1;
    });
    dialog?.addEventListener("close", () => {
      window.__snytDialogCloseEvents += 1;
    });
    dialog?.addEventListener("cancel", () => {
      window.__snytDialogCancelEvents += 1;
    });
  }, attributes);
}

test("snyt-dialog-root opens with command buttons and syncs state, events, aria, and scroll lock", async ({
  page,
}) => {
  await page.goto("/");
  await mountDialog(page);

  const root = page.locator("snyt-dialog-root#case");
  const popup = page.locator("dialog#case-popup");
  const panel = page.locator("snyt-dialog-panel#panel");
  const backdrop = page.locator("snyt-dialog-backdrop#backdrop");
  const open = page.locator("#open");
  const outsideOpen = page.locator("#outside-open");
  const close = page.locator("#close");

  await expect(root).toHaveAttribute("data-state", "closed");
  await expect(popup).toHaveAttribute("data-state", "closed");
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await expect(outsideOpen).toHaveAttribute("aria-expanded", "false");
  await expect(close).toHaveAttribute("aria-expanded", "false");

  await outsideOpen.click();

  await expect(root).toHaveAttribute("open", "");
  await expect(root).toHaveAttribute("data-state", "open");
  await expect(root).toHaveAttribute("data-modal", "");
  await expect(popup).toHaveAttribute("open", "");
  await expect(popup).toHaveAttribute("data-state", "open");
  await expect(panel).toHaveAttribute("data-state", "open");
  await expect(backdrop).toHaveAttribute("data-state", "open");
  await expect(open).toHaveAttribute("aria-expanded", "true");
  await expect(outsideOpen).toHaveAttribute("aria-expanded", "true");
  await expect(close).toHaveAttribute("aria-expanded", "true");
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.overflow))
    .toBe("hidden");
  await expect(page.locator("html")).toHaveAttribute("data-snyt-scroll-locked", "");
  await expect
    .poll(() =>
      page.evaluate(() =>
        document.documentElement.style.getPropertyValue("--snyt-scrollbar-width"),
      ),
    )
    .toMatch(/\d+px/);

  await close.click();

  await expect(root).not.toHaveAttribute("open");
  await expect(root).toHaveAttribute("data-state", "closed");
  await expect(popup).not.toHaveAttribute("open");
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  await expect(page.locator("html")).not.toHaveAttribute("data-snyt-scroll-locked");
  await expect
    .poll(() =>
      page.evaluate(() =>
        document.documentElement.style.getPropertyValue("--snyt-scrollbar-width"),
      ),
    )
    .toBe("");
  await expect
    .poll(() =>
      page.evaluate(() => ({
        close: window.__snytDialogCloseEvents,
        open: window.__snytDialogOpenEvents,
      })),
    )
    .toEqual({ close: 1, open: 1 });
});

test("snyt-dialog-root supports preventable request-close, Escape, and light dismiss", async ({
  page,
}) => {
  await page.goto("/");
  await mountDialog(page);
  await page.evaluate(() => {
    document.querySelector("snyt-dialog-root")?.addEventListener("cancel", (event) => {
      event.preventDefault();
    });
  });

  await page.locator("#open").click();
  await page.locator("#request-close").click();
  await expect(page.locator("snyt-dialog-root#case")).toHaveAttribute("open", "");

  await page.keyboard.press("Escape");
  await expect(page.locator("snyt-dialog-root#case")).toHaveAttribute("open", "");

  await page.mouse.click(10, 10);
  await expect(page.locator("snyt-dialog-root#case")).toHaveAttribute("open", "");
  await expect.poll(() => page.evaluate(() => window.__snytDialogCancelEvents)).toBe(3);

  await page.locator("#close").click();
  await expect(page.locator("snyt-dialog-root#case")).not.toHaveAttribute("open");
});

test("snyt-dialog-root respects dismissible and disabled semantics", async ({ page }) => {
  await page.goto("/");
  await mountDialog(page, 'dismissible="false"');

  await page.locator("#open").click();
  await page.keyboard.press("Escape");
  await page.mouse.click(10, 10);
  await page.locator("#request-close").click();
  await expect(page.locator("snyt-dialog-root#case")).toHaveAttribute("open", "");

  await page.locator("#close").click();
  await expect(page.locator("snyt-dialog-root#case")).not.toHaveAttribute("open");

  await mountDialog(page, "disabled");
  await page.locator("#open").click();
  await expect(page.locator("snyt-dialog-root#case")).not.toHaveAttribute("open");
});

test("snyt-dialog-root syncs direct native showModal, show, close, and root hide", async ({
  page,
}) => {
  await page.goto("/");
  await mountDialog(page);

  await page.evaluate(() => document.querySelector<HTMLDialogElement>("#case-popup")?.showModal());
  await expect(page.locator("snyt-dialog-root#case")).toHaveAttribute("open", "");
  await expect(page.locator("snyt-dialog-root#case")).toHaveAttribute("data-modal", "");

  await page.evaluate(() =>
    (
      document.querySelector("snyt-dialog-root") as unknown as {
        hide: (options?: object) => void;
      } | null
    )?.hide({
      restoreFocus: false,
    }),
  );
  await expect(page.locator("snyt-dialog-root#case")).not.toHaveAttribute("open");

  await page.evaluate(() => document.querySelector<HTMLDialogElement>("#case-popup")?.show());
  await expect(page.locator("snyt-dialog-root#case")).toHaveAttribute("open", "");
  await expect(page.locator("snyt-dialog-root#case")).not.toHaveAttribute("data-modal");
  await expect(page.locator("html")).not.toHaveAttribute("data-snyt-scroll-locked");
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe("");

  await page.evaluate(() => document.querySelector<HTMLDialogElement>("#case-popup")?.close());
  await expect(page.locator("snyt-dialog-root#case")).not.toHaveAttribute("open");
});

test("snyt-dialog-root does not light dismiss when dragging from the panel to outside", async ({
  page,
}) => {
  await page.goto("/");
  await mountDialog(page);

  await page.locator("#open").click();

  const box = await page.locator("#panel").boundingBox();
  expect(box).toBeTruthy();

  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(5, 5);
  await page.mouse.up();

  await expect(page.locator("snyt-dialog-root#case")).toHaveAttribute("open", "");
});

test("snyt-dialog-root keeps scroll locked while nested modal dialogs are open", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    document.body.innerHTML = `
      <main style="min-height: 2200px; padding: 40px;">
        <snyt-dialog-root id="parent">
          <button id="parent-open" type="button" commandfor="parent-popup" command="show-modal">
            Open parent
          </button>
          <dialog id="parent-popup" style="width: 360px; border: 0; padding: 0;">
            <snyt-dialog-panel style="display: block; padding: 20px; background: white; color: black;">
              <h2>Parent</h2>
              <snyt-dialog-root id="child">
                <button id="child-open" type="button" commandfor="child-popup" command="show-modal">
                  Open child
                </button>
                <dialog id="child-popup" style="width: 280px; border: 0; padding: 0;">
                  <snyt-dialog-panel style="display: block; padding: 20px; background: white; color: black;">
                    <h2>Child</h2>
                    <button id="child-close" type="button" commandfor="child-popup" command="close">
                      Close child
                    </button>
                  </snyt-dialog-panel>
                </dialog>
              </snyt-dialog-root>
              <button id="parent-close" type="button" commandfor="parent-popup" command="close">
                Close parent
              </button>
            </snyt-dialog-panel>
          </dialog>
        </snyt-dialog-root>
      </main>
    `;
  });

  await page.locator("#parent-open").click();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.overflow))
    .toBe("hidden");

  await page.locator("#child-open").click();
  await expect(page.locator("snyt-dialog-root#parent")).toHaveAttribute(
    "data-child-dialog-open",
    "",
  );
  await expect(page.locator("snyt-dialog-root#child")).toHaveAttribute("data-nested", "");
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.overflow))
    .toBe("hidden");

  await page.locator("#child-close").click();
  await expect(page.locator("snyt-dialog-root#child")).not.toHaveAttribute("open");
  await expect(page.locator("snyt-dialog-root#parent")).not.toHaveAttribute(
    "data-child-dialog-open",
  );
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.overflow))
    .toBe("hidden");

  await page.locator("#parent-close").click();
  await expect(page.locator("snyt-dialog-root#parent")).not.toHaveAttribute("open");
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe("");
});
