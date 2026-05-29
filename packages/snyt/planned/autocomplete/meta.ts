import type { SnytComponentMetadata } from "../../src/component-metadata.ts";

export const snytAutocompletePlan = {
  description: "Autocomplete primitive built around an author-provided native input.",
  name: "autocomplete",
  status: "planned",
  tagName: "snyt-autocomplete-root",
} as const satisfies SnytComponentMetadata;
