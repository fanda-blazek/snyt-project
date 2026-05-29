export type SnytBooleanAttribute = boolean | "" | "true" | "false";
export type SnytStringAttribute = string;

export interface SnytToggleAttributes {
  disabled?: SnytBooleanAttribute;
  pressed?: SnytBooleanAttribute;
}

export interface SnytDialogRootAttributes {
  disabled?: SnytBooleanAttribute;
  dismissible?: SnytBooleanAttribute;
  open?: SnytBooleanAttribute;
}

export type SnytDialogPanelAttributes = Record<never, never>;

export type SnytDialogBackdropAttributes = Record<never, never>;

export interface SnytElementAttributes {
  "snyt-dialog-backdrop": SnytDialogBackdropAttributes;
  "snyt-dialog-panel": SnytDialogPanelAttributes;
  "snyt-dialog-root": SnytDialogRootAttributes;
  "snyt-toggle": SnytToggleAttributes;
}

export type SnytElements<GlobalAttributes = Record<string, unknown>> = {
  [Name in keyof SnytElementAttributes]: SnytElementAttributes[Name] & GlobalAttributes;
};
