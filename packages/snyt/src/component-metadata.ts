export type SnytComponentStatus = "planned" | "in-progress" | "experimental" | "stable";

export interface SnytComponentMetadata {
  description: string;
  name: string;
  status: SnytComponentStatus;
  tagName: `snyt-${string}`;
}
