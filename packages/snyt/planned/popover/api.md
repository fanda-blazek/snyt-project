# Popover

Status: planned

Purpose: Show anchored non-modal content from a trigger.

Parts: root, trigger, portal, positioner, popup, arrow, close.

Native base: HTML `popover` attribute where possible, anchored popup behavior where needed.

Implementation note: do not port the old React popover component. Keep only the
native API adapters:

- `internal/native-popover.ts` for `popover`, `popovertarget`, and
  `showPopover()` / `hidePopover()` / `togglePopover()`.
- `internal/anchor-position.ts` for `anchor-name`, `position-anchor`,
  `position-area`, and position try properties.

CSS Anchor Positioning is a progressive enhancement. Components that use it must
still provide a fallback when `supportsAnchorPositioning()` returns `false`.
