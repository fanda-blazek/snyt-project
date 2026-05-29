import { expect, test } from "vite-plus/test";
import type {
  SnytBooleanAttribute,
  SnytDialogRootAttributes,
  SnytElements,
  SnytToggleAttributes,
} from "../src/types.ts";

type AppAttributes = {
  class?: string;
  id?: string;
};

const toggleAttributes = {
  disabled: "false",
  id: "format-bold",
  pressed: true,
} satisfies SnytToggleAttributes & AppAttributes;

const dialogAttributes = {
  dismissible: "",
  id: "delete-dialog-root",
  open: false,
} satisfies SnytDialogRootAttributes & AppAttributes;

const frameworkElements = {
  "snyt-dialog-backdrop": {
    class: "backdrop",
  },
  "snyt-dialog-panel": {
    class: "panel",
  },
  "snyt-dialog-root": dialogAttributes,
  "snyt-toggle": toggleAttributes,
} satisfies SnytElements<AppAttributes>;

const booleanAttributeValues = [true, false, "", "true", "false"] satisfies SnytBooleanAttribute[];

test("public framework types accept author-settable attributes", () => {
  expect(frameworkElements["snyt-toggle"].pressed).toBe(true);
  expect(frameworkElements["snyt-dialog-root"].dismissible).toBe("");
  expect(booleanAttributeValues).toHaveLength(5);
});
