# Always-loaded core (small, project-wide)

@.agents/rules/project.md

@.agents/rules/code-principles.md

# Domain rules - load on demand

Domain-specific rules are NOT auto-imported, to keep the baseline small. Read
them when the work touches the matching area (CLAUDE.md routes the mapping; the
rule files live at `.agents/rules/`):

- `jsr.md` - anything under `projects/api/`: static types, symbol docs, and
  provenance publishing that keep the `@trakt/api` JSR score at 100.
- `schemas.md` - authoring ts-rest + Zod contract schemas under
  `projects/api/src/contracts/` (schema shape is a generated public artifact).
- `developer.md` - anything under `projects/developer/`: the SvelteKit developer
  portal's structure, architecture, modules, state, security, testing, and code
  formatting/spacing conventions.
- `developer-ui.md` - `.svelte`/`.scss`/`.css` under `projects/developer/src/`:
  Svelte 5 runes, props, `{#each}` keys, CSS class naming, design tokens,
  logical properties, and accessibility.
- `developer-performance.md` - portal perf work: animations, event listeners,
  observers, large lists, bundle, and images.

Read with the Read tool when the task enters the domain. Re-read after long gaps
if context was compacted.
