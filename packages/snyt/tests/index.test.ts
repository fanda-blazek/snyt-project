import { expect, test } from "vite-plus/test";
import {
  SNYT_TOGGLE_CHANGE_EVENT,
  SNYT_TOGGLE_TAG_NAME,
  snytElementPrefix,
  snytToggleComponent,
} from "../src/index.ts";
import { snytDialogPlan } from "../planned/dialog/index.ts";

test("exports the custom element prefix", () => {
  expect(snytElementPrefix).toBe("snyt");
});

test("exports the toggle contract", () => {
  expect(SNYT_TOGGLE_TAG_NAME).toBe("snyt-toggle");
  expect(SNYT_TOGGLE_CHANGE_EVENT).toBe("snyt-toggle-change");
});

test("exports toggle metadata as experimental", () => {
  expect(snytToggleComponent).toEqual({
    description: "Two-state button primitive.",
    name: "toggle",
    status: "experimental",
    tagName: "snyt-toggle",
  });
});

test("keeps planned dialog metadata outside the public runtime exports", () => {
  expect(snytDialogPlan).toEqual({
    description: "Accessible dialog primitive.",
    name: "dialog",
    status: "planned",
    tagName: "snyt-dialog",
  });
});
