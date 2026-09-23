Before implementing anything, identify which area you are working in and read
the corresponding rule file from `.agents/rules/` (only the core rules auto-load
via AGENTS.md; domain rules load on demand):

- Published package (`projects/api/**`): read `jsr.md` - keeps the `@trakt/api`
  JSR score at 100 (static types, symbol docs, provenance publishing).
- Contract schemas (`projects/api/src/contracts/**`): also read `schemas.md`.
- Developer portal (`projects/developer/**`): read `developer.md` - SvelteKit
  structure, architecture, modules, state, security, testing, and the blank-line
  spacing convention for `.ts`/`.svelte`.
- Portal UI (`.svelte`, `.scss`, `.css` under `projects/developer/src/`): also
  read `developer-ui.md` - runes, props, class naming, tokens, accessibility.
- Portal perf work (animations, listeners, observers, large lists, bundle,
  images): also read `developer-performance.md`.
- Everything else: `project.md` and `code-principles.md` (always-on baseline,
  already loaded as core).

@AGENTS.md
