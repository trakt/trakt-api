---
trigger: glob
globs: 'projects/developer/**'
description: 'SvelteKit developer portal: structure, tooling, and code formatting/spacing conventions.'
applyTo: 'projects/developer/**'
---

# Developer Portal Guidelines

## Tech Stack

Svelte 5 (runes mode) + SvelteKit 2 + TypeScript. The portal has its own
`deno.json` and `package.json` and is not part of the root Deno workspace.

## Structure

```
projects/developer/
  src/
    lib/
      api/        # low-level request helpers to the Trakt API
      auth/       # account/session/OAuth handling
      features/
        apps/       # app management (create/edit/list applications)
        developer/  # API explorer UI (request editor, response inspector, guides)
      guides/     # guide markdown parsing/metadata
      markdown/   # markdown rendering
      openapi/    # OpenAPI catalog parsing/filtering
    routes/       # SvelteKit routes (portal pages)
```

## Formatting

- `.ts`/`.spec.ts` files: `deno fmt` (uses this project's own `deno.json`, not
  the root workspace).
- `.svelte` files: prettier, not `deno fmt` (deno fmt doesn't format Svelte) -
  `deno task format:svelte` or `npx prettier --write "src/**/*.svelte"`.
- **Leave a blank line between logical blocks.** Neither formatter inserts
  blank lines for you, and this codebase had drifted toward everything packed
  together with none - imports running straight into the first statement,
  top-level functions/consts touching each other, CSS rules in `<style>` back
  to back. Add them by hand:
  - Between the import block and the first statement/declaration.
  - Between every top-level declaration (function, exported const, type,
    interface).
  - Before each function inside a Svelte `<script>`, and between the
    props/state declarations and the functions that follow.
  - Between every top-level CSS rule in `<style>`.
  - Between `it()`/`describe()` blocks in `.spec.ts` files.
  - Use judgment inside a function body - separate distinct logical steps
    (setup, guard clause, main logic, return), but don't force a blank line
    between two tightly related lines, or as the first/last line of a block.

## Testing

Vitest, tests co-located as `*.spec.ts` next to the source file. Run with
`deno task test` (from `projects/developer`) or `deno task developer:test`
from the repo root.

## Checking

`deno task check` runs `svelte-kit sync` + `svelte-check` for type errors
across `.svelte` and `.ts` files.
