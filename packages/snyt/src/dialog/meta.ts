import type { SnytComponentMetadata } from "../component-metadata.ts";

export const snytDialogComponent = {
  description: "Native-first dialog root primitive.",
  name: "dialog",
  status: "in-progress",
  tagName: "snyt-dialog-root",
} as const satisfies SnytComponentMetadata;
