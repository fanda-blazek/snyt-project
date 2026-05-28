import { expect, test } from "vite-plus/test";
import {
  SNYT_TOGGLE_CHANGE_EVENT,
  SNYT_TOGGLE_TAG_NAME,
  snytElementPrefix,
  snytToggleComponent,
} from "../src/index.ts";

test("exports the custom element prefix", () => {
  expect(snytElementPrefix).toBe("snyt");
});

test("exports the toggle contract", () => {
  expect(SNYT_TOGGLE_TAG_NAME).toBe("snyt-toggle");
  expect(SNYT_TOGGLE_CHANGE_EVENT).toBe("snyt-toggle-change");
});

test("exports toggle metadata as in-progress", () => {
  expect(snytToggleComponent).toEqual({
    description: "Two-state button primitive.",
    name: "toggle",
    status: "in-progress",
    tagName: "snyt-toggle",
  });
});
