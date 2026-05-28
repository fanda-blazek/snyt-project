export {
  defineSnytDialog,
  SNYT_DIALOG_BACKDROP_ATTRIBUTE,
  SNYT_DIALOG_CANCEL_EVENT,
  SNYT_DIALOG_CHANGE_EVENT,
  SNYT_DIALOG_CLOSE_ATTRIBUTE,
  SNYT_DIALOG_DESCRIPTION_ATTRIBUTE,
  SNYT_DIALOG_PANEL_ATTRIBUTE,
  SNYT_DIALOG_POPUP_ATTRIBUTE,
  SNYT_DIALOG_TAG_NAME,
  SNYT_DIALOG_TITLE_ATTRIBUTE,
  SNYT_DIALOG_TRIGGER_ATTRIBUTE,
  SNYT_DIALOG_VIEWPORT_ATTRIBUTE,
  SnytDialogElement,
  snytDialogComponent,
  type SnytDialogCancelEventDetail,
  type SnytDialogChangeEventDetail,
  type SnytDialogChangeReason,
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
import { defineSnytDialog, defineSnytToggle } from "./components/index.ts";

export const snytElementPrefix = "snyt";

export type SnytElementName = `${typeof snytElementPrefix}-${string}`;

defineSnytToggle();
defineSnytDialog();
