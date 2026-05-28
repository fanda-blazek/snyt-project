export type SnytDialogChangeReason =
  | "api"
  | "trigger"
  | "close"
  | "cancel"
  | "light-dismiss"
  | "native";

export interface SnytDialogChangeEventDetail {
  modal: boolean;
  open: boolean;
  reason: SnytDialogChangeReason;
  trigger: Element | null;
}

export interface SnytDialogCancelEventDetail {
  reason: "cancel" | "light-dismiss";
  trigger: Element | null;
}
