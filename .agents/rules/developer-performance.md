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
