export {
  defineSnytToggle,
  SNYT_TOGGLE_CHANGE_EVENT,
  SNYT_TOGGLE_TAG_NAME,
  SNYT_TOGGLE_TRIGGER_ATTRIBUTE,
  SnytToggleElement,
  type SnytToggleChangeEventDetail,
  type SnytToggleChangeReason,
} from "./toggle/index.ts";
import { defineSnytToggle } from "./toggle/index.ts";

export const snytElementPrefix = "snyt";

export type SnytElementName = `${typeof snytElementPrefix}-${string}`;

defineSnytToggle();
