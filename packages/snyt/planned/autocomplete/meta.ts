import type { SnytComponentMetadata } from "../../src/component-metadata.ts";

export const snytAutocompletePlan = {
  description: "Autocomplete primitive built around native input suggestions.",
  name: "autocomplete",
  status: "planned",
  tagName: "snyt-autocomplete",
} as const satisfies SnytComponentMetadata;
