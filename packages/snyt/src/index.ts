export {
  defineSnytToggle,
  SNYT_TOGGLE_CHANGE_EVENT,
  SNYT_TOGGLE_TAG_NAME,
  SNYT_TOGGLE_TRIGGER_ATTRIBUTE,
  SnytToggleElement,
  snytToggleComponent,
  type SnytToggleChangeEventDetail,
  type SnytToggleChangeReason,
} from "./components/index.ts";
export { type SnytComponentMetadata, type SnytComponentStatus } from "./component-metadata.ts";
import { defineSnytToggle } from "./components/index.ts";

export const snytElementPrefix = "snyt";

export type SnytElementName = `${typeof snytElementPrefix}-${string}`;

defineSnytToggle();
