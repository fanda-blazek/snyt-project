export { defineSnytDialog, SnytDialogElement } from "./dialog.ts";
export {
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
} from "./constants.ts";
export {
  type SnytDialogCancelEventDetail,
  type SnytDialogChangeEventDetail,
  type SnytDialogChangeReason,
} from "./types.ts";
export { snytDialogComponent } from "./meta.ts";
