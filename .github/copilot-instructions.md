# trakt-api

Deno monorepo: `@trakt/api` (typed ts-rest + Zod contract and client, published
to JSR) in `projects/api/`, and the SvelteKit developer portal in
`projects/developer/`.

The rules live in `.agents/rules/` and are linked into `.github/instructions/`,
so each one applies to the paths in its `applyTo`:

- `project.md` - structure, tooling, restrictions, commits (all files)
- `code-principles.md` - functional style, early exits, type safety (all files)
- `jsr.md`, `schemas.md` - the published package and its contract schemas
- `developer.md` - the developer portal
- `developer-ui.md` - portal `.svelte` / `.scss` / `.css`
- `developer-performance.md` - portal perf work

Key restrictions:

- Never edit generated output (`projects/api/types/`,
  `projects/developer/static/openapi.json`, `.svelte-kit/`) or hand-edit
  `deno.lock`.
- No new dependencies without asking. Do not touch the publish flow.
- Conventional Commits, scoped `(api)` or `(developer)`. No em-dashes or
  en-dashes.
