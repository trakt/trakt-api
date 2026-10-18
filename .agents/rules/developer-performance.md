---
trigger: glob
globs: 'projects/developer/src/**'
description: 'Developer portal performance: animations, event listeners, observers, large lists, bundle, images, and when not to optimize. Read for perf work.'
applyTo: 'projects/developer/src/**'
---

# Developer Portal Performance Guidelines

The framework-agnostic parts of trakt-web's performance rules. Read when the
work touches animations, scroll/resize/pointer handlers, observers, large
rendered lists (the endpoint sidebar, JSON viewers), the bundle, or images.

## Animation

- **Animate only `transform` and `opacity`.** Other properties (`top`, `width`,
  `height`, `margin`) re-run layout or paint every frame.
  [web.dev: Animations guide](https://web.dev/articles/animations-guide).
- **Do not blanket-declare `will-change`** or `translateZ(0)`. Every promoted
  layer costs GPU memory.
  [MDN: `will-change`](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change).
- For progress or fill bars, use `width` or `clip-path: inset(...)`, not
  `scaleX` (it stretches the corner radius).

## Event Listeners

- **Touch and wheel listeners are `{ passive: true }`** unless the handler calls
  `preventDefault()`.
  [Chrome: passive listeners](https://developer.chrome.com/docs/lighthouse/best-practices/uses-passive-event-listeners).
- **Coalesce scroll/resize work with `requestAnimationFrame`**: at most one
  frame queued, cancelled on teardown. Do not rAF-throttle `pointermove` (panel
  resizing) - browsers already coalesce it.
- **Always remove listeners and cancel timers/rAFs on teardown** (the `$effect`
  cleanup or the action's `destroy`).

## Observers and Large Lists

- One `IntersectionObserver` / `ResizeObserver` per config, observing many
  targets. Keep threshold lists short.
- **Try `content-visibility: auto` before a custom observer** for long
  off-screen content, with `contain-intrinsic-size` to avoid layout shift.
  [web.dev: `content-visibility`](https://web.dev/articles/content-visibility).
- Filter and group large lists (endpoints, response history) in `$derived`, not
  in the template, so the work runs once per change.

## Reactive State and Timers

- **Large data that is only ever replaced uses `$state.raw`.** A deep `$state`
  wraps every nested object in a proxy, and each read goes through it. The
  332-endpoint catalog in `DeveloperApp.svelte` is raw: typing a search and
  clearing it went from about 9 ms to about 6 ms of script. Before switching,
  grep every reader for in-place writes and `bind:` to a field; a raw value
  only updates on reassignment.
- **A timer that only feeds UI under `{#if}` runs only while that UI is shown.**
  Start it in an `$effect` guarded by the same condition, and refresh the value
  when it starts (`AccountMenu.svelte`: the status clock ticks only while the
  menu is open, 1 wakeup per second -> 0 while closed).
- **Memoize per-entry serialization by object identity**, in a `WeakMap`, when
  entries never change after creation (`saveResponseHistory.ts`). Pass the
  reactive array after assigning it, not the plain array you built: reads of a
  `$state` array return proxies, so a plain object and its proxy are two cache
  keys. A send went from N+2 `JSON.parse` calls (N = stored entries, up to 20)
  to 3.

## Looked Like Wins, Were Not

Measured in a browser and dropped. Do not re-propose without a new number.

- Passing body validity from `DeveloperApp` into `RequestEditor` to "parse once
  per keystroke". `isSendDisabled` is a lazy `$derived` read only on send, so
  the body was already parsed once per keystroke for validity.
- Skipping the `headers` reassignment in `setValue` when no header is bound to
  the parameter. Its readers also depend on `values`, so they re-run anyway; no
  script-time change in 4 paired runs.
- `contain` on the workspace panels to cut panel-resize layout. Every panel's
  width changes on drag, so each relayouts anyway, and `contain: paint` would
  clip the request menus.
- Debouncing the endpoint search. `filterEndpoints` takes about 0.09 ms over
  332 endpoints; a debounce only adds lag.

## Bundle

- SvelteKit already splits per route. Do not add manual `import()` splits
  without a measured win.
- Large data such as `openapi.json` is served from `static/` and fetched at
  runtime, not imported into a component's bundle.
- Every dependency ships to the browser - ask before adding one (see the
  restrictions in `project.md`).

## Images

- Set explicit `width` and `height` on `<img>` to avoid layout shift.
- Non-critical images get `loading="lazy"` and `decoding="async"`. Never lazy
  load above-the-fold images.
- Content images use `<img>` with `alt`, not `background-image`.

## When Not to Optimize

- **Do not micro-optimize cold paths.** Optimize per-frame, per-keystroke, and
  per-scroll work, or what shows up in a profile.
- **Measure before and after** in DevTools Performance or Lighthouse. If you
  cannot show the difference, the optimization may not exist.
- When a production change adds a delay (rAF, debounce), update the spec in the
  same commit.
