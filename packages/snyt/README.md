# Snyt

Headless UI primitives built on native Custom Elements.

This package contains the runtime code for Snyt. Components will be added here as framework-agnostic Custom Elements with no runtime dependencies.

## Toggle

```html
<snyt-toggle>
  <button type="button" data-snyt-toggle-trigger>Bold</button>
</snyt-toggle>
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
