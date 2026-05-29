# Collapsible

Status: planned

Purpose: Provide a small platform-first primitive for showing and hiding one
related panel.

## V1 Target

`<snyt-collapsible>` enhances author-provided light DOM. It owns the relationship
between a local trigger and a local panel.

V1 should stay close to the platform:

- native `<button>` for user activation
- native `hidden` for closed panel state
- `aria-expanded` and `aria-controls` for accessibility
- regular attributes for styling state
- no generated controls
- no polyfills
- no global trigger lookup

## Markup

```html
<snyt-collapsible>
  <button type="button" data-snyt-collapsible-trigger>Toggle details</button>

  <div data-snyt-collapsible-panel hidden>Details content</div>
</snyt-collapsible>
```

## Elements

### `<snyt-collapsible>`

Root controller. It finds one trigger and one panel inside itself.

The root is responsible for state sync, ARIA sync, trigger behavior, and methods.

### Trigger

Author-provided button marked with `data-snyt-collapsible-trigger`.

Enhanced attributes:

- `type="button"` when not explicitly set
- `aria-expanded`
- `aria-controls`

V1 does not use `command`, `commandfor`, or custom command events.

### Panel

Author-provided element marked with `data-snyt-collapsible-panel`.

Enhanced attributes:

- generated id when missing
- `hidden` when closed

## Behavior

- Trigger activation toggles the panel.
- `show()` opens the panel.
- `hide()` closes the panel.
- `toggle()` toggles the panel.
- Setting `open` opens the panel.
- Removing `open` closes the panel.
- Setting `hidden` on the panel closes it.
- Removing `hidden` from the panel opens it.

`hidden` on the panel is the source of display behavior. `open` on the root is a
component state mirror.

## State and Styling

Root:

- `open`
- `data-open`
- `data-closed`

Trigger:

- `aria-expanded="true | false"`

Panel:

- `hidden`

`ElementInternals.states` can be added later, but is not required for V1.

## Events

Root emits:

- `open`
- `close`

Events are emitted only when state actually changes.

## Out of Scope for V1

V1 should stay focused on one local trigger controlling one local panel.

Do not add:

- compatibility layers for missing platform APIs
- global browser API modifications
- generated controls
- remote ownership across unrelated DOM subtrees
- alternate trigger protocols
- accordion group behavior
- nested state coordination
- disclosure menu behavior
- animation lifecycle state machines
