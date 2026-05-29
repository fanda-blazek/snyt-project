# Autocomplete

Status: planned

Purpose: Provide a small platform-first autocomplete for free-form text input
with optional suggestions.

## V1 Target

`<snyt-autocomplete-root>` enhances author-provided light DOM. It does not create
controls, polyfill browser features, or patch platform APIs.

V1 should stay close to the platform:

- real native `<input>` for value and form participation
- native popover behavior through Snyt popover helpers
- CSS Anchor Positioning as progressive enhancement
- combobox/listbox ARIA for custom suggestions
- regular attributes for styling state

## Markup

```html
<snyt-autocomplete-root>
  <input name="user" autocomplete="off" />

  <button type="button" data-snyt-autocomplete-trigger>Toggle suggestions</button>

  <snyt-autocomplete-options>
    <snyt-autocomplete-option value="Wade Cooper">Wade Cooper</snyt-autocomplete-option>
    <snyt-autocomplete-option value="Tom Cooper">Tom Cooper</snyt-autocomplete-option>
    <snyt-autocomplete-option value="Jane Doe">Jane Doe</snyt-autocomplete-option>
  </snyt-autocomplete-options>
</snyt-autocomplete-root>
```

## Elements

### `<snyt-autocomplete-root>`

Root controller. It finds the input, options, and optional trigger inside itself.

The root is responsible for filtering, active option state, ARIA sync, and
opening or closing the suggestions.

### Native `<input>`

The input must be supplied by the author. The root never creates one.

Enhanced attributes:

- `role="combobox"`
- `aria-autocomplete="list"`
- `aria-expanded`
- `aria-controls`
- `aria-activedescendant`
- `autocomplete="off"` when not explicitly set

### Trigger

Optional normal button marked with `data-snyt-autocomplete-trigger`.

The root owns trigger behavior. V1 does not use `command`, `commandfor`, or
custom command events.

### `<snyt-autocomplete-options>`

Suggestions container. It must be inside the root, but does not need to be a
direct child.

Enhanced attributes:

- `role="listbox"`
- `popover="manual"`
- generated id when missing

Visibility uses `internal/native-popover.ts`.

### `<snyt-autocomplete-option>`

Selectable suggestion.

Supported attributes:

- `value`
- `disabled`

Enhanced attributes:

- `role="option"`
- `aria-selected`
- `aria-disabled`
- generated id when missing

## Behavior

- Typing filters suggestions.
- Trigger activation toggles suggestions after filtering.
- Arrow keys open suggestions and move the active option.
- Enter selects the active option.
- Escape and Tab close suggestions.
- Blur outside the root closes suggestions.
- Focus stays on the input.
- Active option is represented through `aria-activedescendant`.

Selecting an option:

1. copies the option value into the input
2. dispatches native bubbling `input` from the input
3. dispatches native bubbling `change` from the input
4. closes suggestions

Empty string option values are valid.

## Filtering

V1 uses simple case-insensitive substring matching against:

- option `value`
- option text content

Disabled options are never active or selectable.

No custom filter callback in V1.

## Popover and Positioning

The options element uses native popover through project helpers:

- `showPopover()`
- `hidePopover()`
- `isPopoverOpen()`

If native Popover API is unavailable, V1 does not emulate popup behavior.

CSS Anchor Positioning may be applied through `internal/anchor-position.ts`. When
unsupported, authors position the options with regular CSS inside the root.

## Styling State

Root:

- `data-open`
- `data-closed`
- `data-empty`
- `data-disabled`

Options:

- `:popover-open`
- `data-open`
- `data-closed`

Option:

- `hidden`
- `aria-hidden="true"`
- `aria-selected="true"`
- `aria-disabled="true"`

`ElementInternals.states` can be added later, but is not required for V1.

## Events

Root emits:

- `open`
- `close`
- `highlight`
- `select`

The input still emits native `input` and `change` on selection.

## Out of Scope for V1

V1 should stay focused on static, single-value suggestions for one native input.

Do not add:

- compatibility layers for missing platform APIs
- global browser API modifications
- generated form controls
- remote ownership across unrelated DOM subtrees
- alternate trigger protocols
- data fetching or remote querying
- pluggable search engines
- advanced rendering pipelines
- multiple-value selection models
- adjacent component modes
