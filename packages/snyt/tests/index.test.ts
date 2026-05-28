import { expect, test } from "vite-plus/test";
import {
  SNYT_DIALOG_BACKDROP_TAG_NAME,
  SNYT_DIALOG_CANCEL_EVENT,
  SNYT_DIALOG_CLOSE_EVENT,
  SNYT_DIALOG_OPEN_EVENT,
  SNYT_DIALOG_PANEL_TAG_NAME,
  SNYT_DIALOG_ROOT_TAG_NAME,
  SNYT_TOGGLE_CHANGE_EVENT,
  SNYT_TOGGLE_TAG_NAME,
  snytElementPrefix,
  snytDialogComponent,
  snytToggleComponent,
} from "../src/index.ts";

test("exports the custom element prefix", () => {
  expect(snytElementPrefix).toBe("snyt");
});

test("exports the toggle contract", () => {
  expect(SNYT_TOGGLE_TAG_NAME).toBe("snyt-toggle");
  expect(SNYT_TOGGLE_CHANGE_EVENT).toBe("snyt-toggle-change");
});

test("exports the dialog contract", () => {
  expect(SNYT_DIALOG_ROOT_TAG_NAME).toBe("snyt-dialog-root");
  expect(SNYT_DIALOG_PANEL_TAG_NAME).toBe("snyt-dialog-panel");
  expect(SNYT_DIALOG_BACKDROP_TAG_NAME).toBe("snyt-dialog-backdrop");
  expect(SNYT_DIALOG_OPEN_EVENT).toBe("open");
  expect(SNYT_DIALOG_CLOSE_EVENT).toBe("close");
  expect(SNYT_DIALOG_CANCEL_EVENT).toBe("cancel");
});

test("exports toggle metadata as in-progress", () => {
  expect(snytToggleComponent).toEqual({
    description: "Two-state button primitive.",
    name: "toggle",
    status: "in-progress",
    tagName: "snyt-toggle",
  });
});

test("exports dialog metadata as in-progress", () => {
  expect(snytDialogComponent).toEqual({
    description: "Native-first dialog root primitive.",
    name: "dialog",
    status: "in-progress",
    tagName: "snyt-dialog-root",
  });
});
