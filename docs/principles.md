# Snyt Principles

Snyt is a native-first Custom Elements library for headless UI primitives. The
library should feel close to the web platform, remain styling-neutral, and make
component behavior explicit through small, stable contracts.

## Values

- Prefer browser-native APIs before custom protocols.
- Build Custom Elements directly, without framework wrappers.
- Use Light DOM by default so authors keep full control of markup and styling.
- Keep runtime dependencies at zero unless a dependency becomes clearly worth
  the cost.
- Ship no default visual styles from the runtime package.
- Treat accessibility behavior as part of the component contract.
- Keep package output small for npm and CDN usage.

## Component Contracts

- Components enhance author-provided controls and parts instead of generating
  whole interfaces.
- Public markers are component-specific, such as `data-snyt-toggle-trigger`.
- Avoid one-size-fits-all selector protocols that blur component ownership.
- Prefer native elements and attributes when they express the relationship, such
  as `<dialog>`, `commandfor`, `command`, `hidden`, `aria-*`, and form controls.
- Expose styling state through predictable attributes like `open`, `data-open`,
  `data-closed`, `data-disabled`, and `data-state`.
- Author-settable inputs and generated styling state should stay conceptually
  separate.

## Runtime Decisions

- Modules must be safe to import in non-browser environments.
- Element lifecycle cleanup should flow through `AbortSignal` where practical.
- Components should tolerate framework-rendered children by doing DOM work after
  the initial connection microtask.
- Native browser behavior should remain observable. If Snyt wraps a native API,
  it should preserve that API's semantics and add only the missing coordination.
- Polyfills and compatibility emulation are not default behavior. Add progressive
  enhancement paths when the native platform supports them.

## Adding Features

- Start with the smallest useful public API.
- Keep component APIs specific to the primitive being built.
- Prefer clear state synchronization over hidden internal magic.
- Test behavior at the boundary users rely on: attributes, events, focus,
  keyboard interaction, form behavior, and cleanup.
- Document the intended markup and decision rules before broadening the runtime
  surface.
