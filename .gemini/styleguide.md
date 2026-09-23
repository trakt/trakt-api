# trakt-api Review Styleguide

Review checklist for the trakt-api monorepo. Each item is a condensed version of
a rule in `.agents/rules/`, which has the full text and reasons. Only review a
file against the sections whose paths match it.

Only flag lines the PR changes. Older code that predates a rule is not a finding
unless the PR touches it.

## All Files

Source: `.agents/rules/project.md`, `.agents/rules/code-principles.md`.

### Restrictions

- Generated output is never edited by hand: `projects/api/types/`,
  `projects/developer/static/openapi.json`, `.svelte-kit/`.
- `deno.lock` changes only come with a matching dependency change in `deno.json`
  / `package.json`.
- New dependencies must be called out and justified in the PR description.
- `.github/workflows/publish.yml`, version fields, and provenance settings are
  not changed unless the PR is about publishing.
- No secrets, tokens, or non-`PUBLIC_*` env values.
- No references to private repositories, internal services, or internal tickets.
- No skipped tests, no loosened compiler options, no lint suppressions for rules
  that catch real bugs.

### Code Principles

- Pure functions for data transformation; side effects (network, storage, DOM)
  at the edges.
- `const` over `let`; `map`/`filter`/`reduce` over loops that push into a
  mutable array; `Readonly` types for read-only data.
- Guard clauses and early returns. No nested `if` statements.
- One job per function. 3+ parameters use a single object parameter.
- Collaborators are passed in as parameters, not created inside the function.
- No `any`. No non-null assertion (`!`). Prefer `.at()` for positional access.
- External data is validated with Zod at the boundary; no `as` casts on parsed
  JSON.

### Commits and Rule Files

- Conventional Commits, scoped `(api)` for the package and `(developer)` for the
  portal. Version bumps are their own `chore(api): bump ...` commit.
- No em-dashes or en-dashes in commit messages or PR text.
- Rule file frontmatter uses single quotes and keeps both `globs` and `applyTo`.
  A new rule file is routed in `CLAUDE.md` and `AGENTS.md`, linked in
  `.github/instructions/`, and summarized here.

## `projects/api/**`

Source: `.agents/rules/jsr.md`, `.agents/rules/schemas.md`.

- Every new or changed exported symbol has a `/** ... */` doc comment.
- A new domain router is added to the `TraktContract` type alias in
  `traktContract.ts`.
- The published entry stays `mod.js` with `@ts-self-types`; nothing adds
  `--allow-slow-types`.
- Explicit composed types on `traktContract`, `users`, the query factories, and
  `builder` are not "simplified" away.
- Responses that vary by entity type are one flat `z.object` with nullish
  shape-specific fields, never `z.union`.
- `deno.json` `version` stays at the `0.0.0` placeholder.

## `projects/developer/**`

Source: `.agents/rules/developer.md`.

- Route files are thin shells that mount a feature component; logic lives in
  `src/lib/`.
- Network, OAuth, and storage calls live in `lib/api/`, `lib/auth/`, or a
  dedicated helper, not in pure helpers.
- Non-trivial logic in a `.svelte` file is extracted into a camelCase `.ts`
  helper with a co-located `*.spec.ts`.
- Nothing imports from another folder's `_internal/`.
- New modules have one export named like the file. No barrel `index.ts` files.
- `$lib/...` aliases instead of deep relative imports; imports include the file
  extension.
- API responses are parsed with a Zod schema before use.
- Shareable UI state lives in the URL and is updated with
  `goto(url, { replaceState: true })`. `page.url` is never mutated in place.
- Tokens and client secrets are never persisted outside the OIDC user store;
  history and copy paths stay redacted.
- A new external origin comes with a matching CSP update in `svelte.config.js`.
  No inline scripts or `unsafe-eval`.
- `{@html}` only renders `renderMarkdown` output.
- A blank line between the import block and code, between top-level
  declarations, before functions in a Svelte `<script>`, between top-level CSS
  rules, and between `it()`/`describe()` blocks.
- `.svelte` files are formatted with prettier; `.ts` files with `deno fmt`.
- New helpers with logic have specs; bug fixes come with a regression spec.

## `projects/developer/src/**/*.{svelte,scss,css}`

Source: `.agents/rules/developer-ui.md`,
`.agents/rules/developer-performance.md`.

- Runes only: no `export let`, `$:`, `createEventDispatcher`, `<slot>`, or
  `$app/stores`.
- No `$effect` that only copies or syncs state - that is `$derived`. Effects
  that add listeners or timers return a cleanup.
- Components with 3+ props have a `ComponentNameProps.ts` type file. Callback
  props are named `onXxx`.
- Every `{#each}` is keyed on a data identifier, never on display text or a
  formatted value.
- The root element has one `trakt-{component-name}` class. Children use plain
  kebab-case without `trakt-` or BEM `__` / `--`.
- Binary states are `class:is-*` / `class:has-*`. Variants are `data-*`
  attributes, not built class strings.
- No bare element selectors in component styles and no `:global()` overrides of
  another component.
- Inline `style=` only sets CSS custom properties.
- No raw colors outside `src/style/app.scss`. Spacing, radii, and borders use
  tokens (`--gap-*`, `--border-radius-*`, `--radius-*`, `--border-thickness-*`,
  `--ni-*`), not new raw `px`.
- No `prefers-color-scheme` or theme selectors (the portal is dark only).
- Layout uses logical properties (`padding-inline-*`, `inset-inline-*`,
  `text-align: start/end`).
- Native interactive elements; every control has an accessible name;
  `outline: none` always has a `:focus-visible` replacement; meaning is not
  carried by color alone.
- Animations touch only `transform` / `opacity`, respect
  `prefers-reduced-motion`, and do not blanket-declare `will-change`.
- Touch and wheel listeners are passive unless they call `preventDefault()`.
  Listeners, timers, and rAFs are cleaned up.
- `<img>` has explicit `width` / `height`; non-critical images are
  `loading="lazy"` + `decoding="async"`.
