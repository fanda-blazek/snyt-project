# Dialog

Status: in-progress

Purpose: Open modal or non-modal content above the page.

Parts: root, trigger, backdrop, viewport, popup, panel, title, description, close.

Native base: `<dialog>` where possible, dialog ARIA and focus management where needed.

Current runtime API:

```html
<snyt-dialog>
  <button type="button" data-snyt-dialog-trigger>Open dialog</button>
  <dialog data-snyt-dialog-popup>
    <div data-snyt-dialog-panel>
      <h2 data-snyt-dialog-title>Dialog title</h2>
      <p data-snyt-dialog-description>Dialog description.</p>
      <button type="button" data-snyt-dialog-close>Close</button>
    </div>
  </dialog>
</snyt-dialog>
```

Use `data-snyt-dialog-trigger="show"` or `"non-modal"` to call `show()` instead of
`showModal()`. Modal triggers are the default.

Events:

- `snyt-dialog-change`: dispatched after open/close state changes.
- `snyt-dialog-cancel`: cancelable dismissal attempt from Escape or light dismiss.
