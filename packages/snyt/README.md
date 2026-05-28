# Snyt

Headless UI primitives built on native Custom Elements.

This package contains the runtime code for Snyt. Components will be added here as framework-agnostic Custom Elements with no runtime dependencies.

## Toggle

```html
<snyt-toggle>
  <button type="button" data-snyt-toggle-trigger>Bold</button>
</snyt-toggle>
```

## Dialog

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
