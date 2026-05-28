import { expect, test } from "@playwright/test";

const scrollLockModuleUrl = `/@fs${process.cwd()}/packages/snyt/src/internal/scroll-lock.ts`;

test("scroll lock scopes state to the referenced document", async ({ page }) => {
  await page.goto("/");

  const result = await page.evaluate(async (moduleUrl) => {
    const scrollLock = (await import(moduleUrl)) as {
      isScrollLocked(options?: { referenceElement?: Element | null }): boolean;
      lockScroll(owner: object, options?: { referenceElement?: Element | null }): () => void;
    };
    const iframe = document.createElement("iframe");

    document.body.append(iframe);

    const iframeDocument = iframe.contentDocument!;

    iframeDocument.body.innerHTML = `<main style="min-height: 2000px"></main>`;

    const release = scrollLock.lockScroll({}, { referenceElement: iframeDocument.documentElement });
    const locked = {
      childAttribute: iframeDocument.documentElement.hasAttribute("data-snyt-scroll-locked"),
      childIsLocked: scrollLock.isScrollLocked({
        referenceElement: iframeDocument.documentElement,
      }),
      childOverflow: iframeDocument.documentElement.style.overflow,
      parentAttribute: document.documentElement.hasAttribute("data-snyt-scroll-locked"),
      parentIsLocked: scrollLock.isScrollLocked({
        referenceElement: document.documentElement,
      }),
    };

    release();

    const released = {
      childAttribute: iframeDocument.documentElement.hasAttribute("data-snyt-scroll-locked"),
      childIsLocked: scrollLock.isScrollLocked({
        referenceElement: iframeDocument.documentElement,
      }),
      childOverflow: iframeDocument.documentElement.style.overflow,
    };

    iframe.remove();

    return { locked, released };
  }, scrollLockModuleUrl);

  expect(result).toEqual({
    locked: {
      childAttribute: true,
      childIsLocked: true,
      childOverflow: "hidden",
      parentAttribute: false,
      parentIsLocked: false,
    },
    released: {
      childAttribute: false,
      childIsLocked: false,
      childOverflow: "",
    },
  });
});

test("scroll lock reference counts owners and restores inline styles", async ({ page }) => {
  await page.goto("/");

  const result = await page.evaluate(async (moduleUrl) => {
    const scrollLock = (await import(moduleUrl)) as {
      isScrollLocked(options?: { referenceElement?: Element | null }): boolean;
      lockScroll(owner: object, options?: { referenceElement?: Element | null }): () => void;
      resetScrollLock(options?: { referenceElement?: Element | null }): void;
    };
    const html = document.documentElement;
    const body = document.body;

    scrollLock.resetScrollLock({ referenceElement: html });
    html.style.overflow = "clip";
    html.style.paddingInlineEnd = "3px";
    html.style.scrollBehavior = "smooth";
    body.style.overflow = "clip";
    body.style.scrollBehavior = "smooth";

    const firstRelease = scrollLock.lockScroll({ id: "first" }, { referenceElement: html });
    const secondRelease = scrollLock.lockScroll({ id: "second" }, { referenceElement: html });
    const locked = {
      attribute: html.hasAttribute("data-snyt-scroll-locked"),
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
      isLocked: scrollLock.isScrollLocked({ referenceElement: html }),
      scrollbarWidth: html.style.getPropertyValue("--snyt-scrollbar-width"),
    };

    firstRelease();

    const afterFirstRelease = {
      attribute: html.hasAttribute("data-snyt-scroll-locked"),
      isLocked: scrollLock.isScrollLocked({ referenceElement: html }),
    };

    secondRelease();

    const restored = {
      attribute: html.hasAttribute("data-snyt-scroll-locked"),
      bodyOverflow: body.style.overflow,
      bodyScrollBehavior: body.style.scrollBehavior,
      htmlOverflow: html.style.overflow,
      htmlPaddingInlineEnd: html.style.paddingInlineEnd,
      htmlScrollBehavior: html.style.scrollBehavior,
      isLocked: scrollLock.isScrollLocked({ referenceElement: html }),
      scrollbarWidth: html.style.getPropertyValue("--snyt-scrollbar-width"),
    };

    html.style.overflow = "";
    html.style.paddingInlineEnd = "";
    html.style.scrollBehavior = "";
    body.style.overflow = "";
    body.style.scrollBehavior = "";

    return { afterFirstRelease, locked, restored };
  }, scrollLockModuleUrl);

  expect(result.locked).toMatchObject({
    attribute: true,
    bodyOverflow: "hidden",
    htmlOverflow: "hidden",
    isLocked: true,
  });
  expect(result.locked.scrollbarWidth).toMatch(/\d+px/);
  expect(result.afterFirstRelease).toEqual({
    attribute: true,
    isLocked: true,
  });
  expect(result.restored).toEqual({
    attribute: false,
    bodyOverflow: "clip",
    bodyScrollBehavior: "smooth",
    htmlOverflow: "clip",
    htmlPaddingInlineEnd: "3px",
    htmlScrollBehavior: "smooth",
    isLocked: false,
    scrollbarWidth: "",
  });
});
