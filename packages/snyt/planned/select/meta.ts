import type { SnytComponentMetadata } from "../../src/component-metadata.ts";

export const snytSelectPlan = {
  description: "Select primitive for choosing a predefined value.",
  name: "select",
  status: "planned",
  tagName: "snyt-select",
} as const satisfies SnytComponentMetadata;
