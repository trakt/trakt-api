---
trigger: glob
globs: 'projects/developer/src/**/*.{svelte,scss,css}'
description: 'Developer portal UI: Svelte 5 runes, props, snippets, each keys, CSS class naming, design tokens, logical properties, and accessibility.'
applyTo: 'projects/developer/src/**/*.{svelte,scss,css}'
---

# Developer Portal UI Guidelines

Same conventions as trakt-web components, minus the parts the portal does not
have (i18n, guards, theme switching, RxJS stores). Read `developer.md` first.

## Svelte 5 Runes

Runes only. Never `export let`, `$:`, `createEventDispatcher`, `<slot>`, or
`$app/stores`.

| Rune            | Use                                                        |
| --------------- | ---------------------------------------------------------- |
| `$props()`      | Declare props                                              |
| `$state`        | Local mutable state                                        |
| `$derived`      | Computed value - the default for anything derived          |
| `$derived.by()` | Computed value that needs a multi-line body                |
| `$effect`       | Last resort for real side effects (DOM, timers, listeners) |

- **Do not use `$effect` to sync state.** If a value can be computed from other
  state, it is `$derived`. An `$effect` that writes `$state` is almost always a
  bug waiting for a loop.
- An `$effect` that adds a listener or timer returns a cleanup function.

## Props

- **3+ props -> a `ComponentNameProps.ts` type file** next to the component
  (`RequestEditorProps.ts`, `ResponseInspectorProps.ts`). One or two props can
  stay inline.
- Destructure with defaults in one statement:
  `const { endpoint, isSending = false }: RequestEditorProps = $props();`
- Callbacks are props named `onXxx` (`onDeleteResponse`), not dispatched events.
- Pass composable content as `Snippet` props, rendered with `{@render ...}`.

## Keying `{#each}` Blocks

Always key, and key on identity the data owns: `(endpoint.id)`,
`(account.slot)`, `(expectedResponse.status)`. Never key on display text or a
formatted value - duplicates make Svelte throw `each_key_duplicate` and blank
the page. When the data has no identifier, add one where the data is built.
Positional keys (`(index)`) are only for static lists with no identity, like
skeleton rows.

## CSS Class Naming

Non-BEM, namespaced kebab-case, same as trakt-web.

1. **Root class `trakt-{component-name-kebab}`** on the component's outermost
   element (`RequestEditor.svelte` -> `.trakt-request-editor`). One root class.
   Icon-only and wrapper components without styles are exempt.
2. **Child classes are plain kebab-case**, nested under the root in SCSS
   (`.trakt-request-editor .panel-resizer`). No `trakt-` on children, no BEM
   `__` / `--`.
3. **Binary states use `is-*` / `has-*`** toggled with `class:`
   (`class:is-selected`, `class:is-sending`). Not `class:visible` or
   `class:active`.
4. **Variants use `data-*` attributes**, not class strings: `data-method`,
   `data-status`, `data-state`, `data-variant`, `data-size`. Never
   `class="btn btn-{variant}"`.
5. **Selectors anchor to the root or a child class.** No bare element selectors
   (`button { }`) in component styles, and no `:global()` overrides of another
   component from its consumer - give that component a prop or a CSS variable
   hook instead.
6. **Inline `style=` only for CSS custom properties**
   (`style="--panel-width: {width}px"`). Never raw property values.

## Design Tokens

- **Colors come from the `--color-*` tokens in `src/style/app.scss`.** Raw hex,
  `rgb()`, or `oklch()` values belong only there. A new color means a new
  semantic token in `app.scss` first.
- **Spacing and sizes use tokens** from `src/style/numeric-increments/` and
  `src/style/sizing/`: `--gap-*` for spacing, `--border-radius-*` / `--radius-*`
  for corners, `--border-thickness-*` for borders, `--ni-*` for other lengths.
  Older styles still have raw `px`; do not add more.
- Reuse the shared mixins in `src/style/` instead of repeating their rules:
  `_action-button.scss` (buttons), `_method-colors.scss` (HTTP method
  `[data-method]` colors), `_select-caret.scss` (the custom `<select>` caret).
  Include a mixin under the selector that needs it, so specificity stays local.
- Render tokenized JSON with `JsonHighlight.svelte`, not a hand-written
  `{#each}` over `tokenizeJson` output.
- The portal is dark only (`color-scheme: dark`). Do not add
  `prefers-color-scheme` or theme selectors.

## Logical Properties

Use logical properties for layout, matching trakt-web (which ships RTL):
`padding-inline-*`, `margin-inline-*`, `inset-inline-start/end`,
`border-inline-*`, `text-align: start/end`, and logical corner radii. Keep
physical `left`/`right` only for JS-measured coordinates and the `left: 50%` +
`translate(-50%)` centering trick.

## Accessibility

- **Native elements first.** `<button>` for actions, `<a href>` for navigation,
  `<dialog>`, `<nav>`, `<form>`. A clickable `<div>` is the wrong choice.
- **Every control has an accessible name.** Icon-only buttons need an
  `aria-label`; form fields need a `<label>`.
- **Keep focus visible.** Never `outline: none` without a `:focus-visible`
  replacement.
- Do not signal meaning with color alone - HTTP method and status badges carry
  their text too.
- Decorative images and SVGs get `alt=""` / `aria-hidden="true"`.
- Wrap non-essential animation in `@media (prefers-reduced-motion: reduce)`.

## Head Content

Static head assets (fonts, icons, base meta) go in `src/app.html`.
`<svelte:head>` is only for per-page values such as `<title>` and share-card
meta.

## Quick Checklist

- [ ] Runes only; no `$effect` that just syncs state
- [ ] Props type file for 3+ props; callbacks named `onXxx`
- [ ] `{#each}` keyed on a data identifier
- [ ] Root class `trakt-*`, kebab-case children, `is-*`/`has-*` states, `data-*`
      variants
- [ ] No raw colors outside `app.scss`; spacing via tokens
- [ ] Logical properties for layout
- [ ] Native controls, accessible names, visible focus
- [ ] `{@html}` only with `renderMarkdown` output
