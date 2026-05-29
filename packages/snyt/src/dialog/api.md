# Dialog Root

`<snyt-dialog-root>` is a native-first dialog controller built around the real HTML
`<dialog>` element.

It does not replace `<dialog>`. It enhances it with reliable state attributes,
command support, scroll locking, focus restore, dismiss behavior, and nested dialog
handling.

## Basic Usage

Use standard HTML commands to control the native dialog:

```html
<snyt-dialog-root>
  <button type="button" commandfor="delete-dialog" command="show-modal">Open dialog</button>

  <dialog id="delete-dialog" aria-labelledby="delete-title" aria-describedby="delete-description">
    <snyt-dialog-backdrop></snyt-dialog-backdrop>

    <snyt-dialog-panel>
      <h2 id="delete-title">Delete draft?</h2>
      <p id="delete-description">This action cannot be undone.</p>

      <button type="button" commandfor="delete-dialog" command="close">Cancel</button>
    </snyt-dialog-panel>
  </dialog>
</snyt-dialog-root>
```

## Native Commands

`commandfor` points to the native dialog by id.

- `command="show-modal"` opens the dialog modally.
- `command="close"` closes immediately.
- `command="request-close"` asks to close and can be prevented.

## Real Dialog Element

The dialog is always a real native `<dialog>` element. Browser modal behavior, form
support, focus handling, and accessibility semantics stay close to the platform.

## Root Controller

`<snyt-dialog-root>` manages the behavior around the native dialog:

- open and closed state
- modal state
- scroll lock
- focus restore
- light dismiss
- cancel prevention
- nested dialog state
- command button sync

## Panel and Backdrop

Use `<snyt-dialog-panel>` for the interactive surface and `<snyt-dialog-backdrop>`
for the visual layer behind it.

## State Attributes

Snyt syncs styling-friendly state attributes:

- `open`
- `data-state="open | closed"`
- `data-open`
- `data-closed`
- `data-modal`
- `data-nested`
- `data-child-dialog-open`

## Dismiss Behavior

Dialogs can close through native commands, Escape, outside click, root methods, or
`dialog.close()`.

Cancelable dismissals dispatch `cancel` and can be prevented.

## Dismissible

`dismissible="false"` blocks Escape, outside click, and `request-close`.

It does not block explicit `command="close"`.

## Disabled

`disabled` prevents opening the dialog.

It does not prevent closing an already-open dialog.

## Focus Restore

Focus returns to the opener when the dialog closes.

Use `hide({ restoreFocus: false })` to skip focus restore.

## Imperative API

```js
dialogRoot.show();
dialogRoot.hide();
dialogRoot.hide({ restoreFocus: false });
```

## Events

`<snyt-dialog-root>` emits simple lifecycle events:

- `open`
- `close`
- `cancel`

`cancel` is cancelable.

## Highlights

- Real native `<dialog>` under the hood
- Native `commandfor` / `command` buttons
- No custom trigger API
- Styling-friendly state attributes
- Preventable dismiss behavior
- Scroll lock and focus restore built in
- Nested dialogs handled correctly
- Small API surface close to the web platform
