# Snyt

Headless UI primitives built on native Custom Elements.

This package contains the runtime code for Snyt. Components will be added here as framework-agnostic Custom Elements with no runtime dependencies.

Project direction and component authoring rules are documented in [Snyt Principles](../../docs/principles.md).

## Toggle

```html
<snyt-toggle>
  <button type="button" data-snyt-toggle-trigger>Bold</button>
</snyt-toggle>
```

## Dialog

```html
<snyt-dialog-root>
  <button type="button" commandfor="delete-dialog" command="show-modal">Open dialog</button>

  <dialog id="delete-dialog" aria-labelledby="delete-title" aria-describedby="delete-description">
    <snyt-dialog-backdrop></snyt-dialog-backdrop>
    <snyt-dialog-panel>
      <h2 id="delete-title">Delete draft?</h2>
      <p id="delete-description">This action cannot be undone.</p>
      <button type="button" commandfor="delete-dialog" command="close">Close</button>
    </snyt-dialog-panel>
  </dialog>
</snyt-dialog-root>
```

Importing the package registers the element:

```ts
import "snyt";
```

## Development

```bash
vp install
vp test
vp pack
```
