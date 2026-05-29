import type { SnytComponentMetadata } from "../component-metadata.ts";

export const snytToggleComponent = {
  description: "Two-state button primitive.",
  name: "toggle",
  status: "in-progress",
  tagName: "snyt-toggle",
} as const satisfies SnytComponentMetadata;
