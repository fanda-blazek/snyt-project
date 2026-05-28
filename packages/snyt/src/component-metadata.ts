export type SnytComponentStatus = "planned" | "experimental" | "stable";

export interface SnytComponentMetadata {
  description: string;
  name: string;
  status: SnytComponentStatus;
  tagName: `snyt-${string}`;
}
