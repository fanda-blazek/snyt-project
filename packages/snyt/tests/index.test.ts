import { expect, test } from "vite-plus/test";
import { SNYT_TOGGLE_CHANGE_EVENT, SNYT_TOGGLE_TAG_NAME, snytElementPrefix } from "../src/index.ts";

test("exports the custom element prefix", () => {
  expect(snytElementPrefix).toBe("snyt");
});

test("exports the toggle contract", () => {
  expect(SNYT_TOGGLE_TAG_NAME).toBe("snyt-toggle");
  expect(SNYT_TOGGLE_CHANGE_EVENT).toBe("snyt-toggle-change");
});
