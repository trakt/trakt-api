---
trigger: glob
globs: 'projects/developer/**'
description: 'SvelteKit developer portal: structure, architecture, modules, state, security, testing, tooling, and code formatting/spacing conventions.'
applyTo: 'projects/developer/**'
---

# Developer Portal Guidelines

Front-end practices here follow trakt-web, trimmed to what the portal actually
uses. UI, styling, and accessibility rules are in `developer-ui.md`; perf rules
are in `developer-performance.md`.

These rules apply to new code and code you touch. The portal was brought in line
with them in one pass; the known leftovers are raw `px` values without an exact
token and descendant element selectors (`.panel input`) in component styles. Do
not sweep unrelated files to conform; fix what you touch.

## Tech Stack

Svelte 5 (runes mode) + SvelteKit 2 + TypeScript, built with `adapter-static`
and deployed to GitHub Pages. The portal has its own `deno.json` and
`package.json` and is not part of the root Deno workspace. There is no RxJS,
query library, or i18n layer - do not add one without asking.

## Structure

```
projects/developer/
  scripts/        # build-time generators (OpenAPI, share cards)
  static/         # served as-is; openapi.json is GENERATED
  src/
    lib/
      api/        # low-level request helpers to the Trakt API
      auth/       # account/session/OAuth handling
      features/
        apps/       # app management (create/edit/list applications)
        developer/  # API explorer UI (request editor, response inspector, guides)
      guides/     # guide markdown parsing/metadata
      markdown/   # markdown rendering (the only HTML producer)
      openapi/    # OpenAPI catalog parsing/filtering
    routes/       # SvelteKit routes (thin shells)
    style/        # global SCSS: tokens, sizing, shared mixins
```

## Architecture

- **Routes are thin shells.** A `+page.svelte` mounts one feature component and
  passes route params. Logic lives in `lib/`, not in route files.
- **Features own their UI and logic.** `lib/features/{feature}/` holds that
  feature's components, props types, and pure helpers.
- **Side effects stay in `lib/api/` and `lib/auth/`.** Network, OAuth, and
  storage calls live there. Components call them; pure helpers never do.
- **Pull logic out of components.** When a `.svelte` file grows a non-trivial
  computation (parsing, validation, formatting, URL building), move it into a
  camelCase `.ts` helper next to the component and cover it with a spec. The
  large components (`RequestEditor`, `DeveloperApp`) should shrink over time,
  not grow.
- **`_internal/` is private.** A file in `folderA/_internal/` may only be
  imported from inside `folderA/`. If another folder needs it, move it up.

## Modules

- **One export per file, named like the file.** `applicationUrl.ts` exports
  `applicationUrl`; `Endpoint.ts` exports the `Endpoint` type. Unexported
  helpers inside the file are fine. Promote a helper to its own file only when a
  second module needs it, and give it a name that still makes sense outside its
  old file (`usernameKey`, not `key`).
- **Case collisions stay together.** A type and a function whose names differ
  only by case (`PortalSession` / `portalSession`) share one file: macOS
  filesystems are case-insensitive and the repo has `core.ignorecase=true`. For
  a case-only rename, `git rm --cached` the old path and `git add` the new one,
  or Linux CI will not see the change.
- **No barrel files.** No `index.ts` that only re-exports. Import from the file
  that owns the symbol.
- **Use `$lib/...` aliases**, never deep relative paths (`../../`). Sibling
  imports (`./X.ts`) are fine.
- **Include the file extension** in imports (`.ts`, `.svelte`).
- **Naming:** PascalCase for components, types, and their files
  (`ApplicationForm.svelte`, `ResponseHistoryEntry.ts`); camelCase for
  functions, variables, and helper files (`buildEndpointUrl.ts`); ALL_CAPS only
  for module-level constants.

## Data and State

- **Validate every API response with Zod** before use (see `listApplications.ts`
  / `applicationSchema.ts`). Schema first, type from `z.infer`. On a failed
  parse, throw an error with a user-facing message, not the Zod output.
- **UI state that should survive a reload or a shared link goes in the URL**
  (selected endpoint, tabs, filters). Update it with
  `goto(url, { replaceState: true })` so it does not flood history.
- **Never mutate `page.url` from `$app/state` in place.** Build a copy
  (`new URL(page.url)`), change it, then `goto` it.
- **Storage keys, parsing, and validation live in a helper**, not in a
  component. Helpers take the `Storage` as a parameter
  (`loadResponseHistory(storage)`); the component passes
  `globalThis.sessionStorage` in. Direct access in `lib/auth/` uses
  `globalThis.localStorage?.` so it cannot throw when storage is missing.
- **Never persist tokens or client secrets** outside the OIDC user store in
  `userManager.ts`. Response history and copied requests are redacted
  (`redactResponse.ts`); keep new copy/share/history paths redacted too.
- **One definition of "sensitive".** Every redaction path decides with
  `$lib/api/isSensitiveName` (field and header names) and
  `$lib/api/mentionsSensitiveName` (free text), and writes `REDACTED` from
  `$lib/api/REDACTED.ts`. Never add a local list of sensitive names; extend
  `SENSITIVE_FIELD_NAMES` instead.

## Shared Helpers

Reach for these before writing the idiom again:

| Helper                                   | Use for                                           |
| ---------------------------------------- | ------------------------------------------------- |
| `$lib/api/accountRequest`                | Authenticated request as a signed-in account slot |
| `$lib/auth/takeSessionValue`             | Read a sessionStorage value once and remove it    |
| `$lib/auth/parseAccountSlot`             | Turn a stored string into a valid account slot    |
| `features/apps/formatDate`               | Every date label in the apps feature              |
| `features/developer/findParameterHeader` | The header row bound to an endpoint parameter     |

## Security

- **CSP is strict** (`svelte.config.js`: `script-src 'self'`, allowlisted
  `connect-src` / `img-src`). Adding a new origin means updating the CSP in the
  same change. Never add inline scripts or `unsafe-eval`.
- **`{@html}` only renders output of `renderMarkdown`** (which escapes raw HTML
  and filters link protocols). Never pass API data or user input to `{@html}`
  directly.
- **Only `PUBLIC_*` env vars exist.** They ship in the bundle; nothing secret
  can go there.

## Formatting

- `.ts`/`.spec.ts` files: `deno fmt` (uses this project's own `deno.json`, not
  the root workspace).
- `.svelte` files: prettier, not `deno fmt` (deno fmt doesn't format Svelte) -
  `deno task format:svelte` or `npx prettier --write "src/**/*.svelte"`.
  Prettier is only for `.svelte` here; never run it on `.ts`.
- **Leave a blank line between logical blocks.** Neither formatter inserts blank
  lines for you, and this codebase had drifted toward everything packed together
  with none - imports running straight into the first statement, top-level
  functions/consts touching each other, CSS rules in `<style>` back to back. Add
  them by hand:
  - Between the import block and the first statement/declaration.
  - Between every top-level declaration (function, exported const, type,
    interface).
  - Before each function inside a Svelte `<script>`, and between the props/state
    declarations and the functions that follow.
  - Between every top-level CSS rule in `<style>`.
  - Between `it()`/`describe()` blocks in `.spec.ts` files.
  - Use judgment inside a function body - separate distinct logical steps
    (setup, guard clause, main logic, return), but don't force a blank line
    between two tightly related lines, or as the first/last line of a block.

## Testing

Vitest, tests co-located as `*.spec.ts` next to the source file. Run with
`deno task test` (from `projects/developer`) or `deno task developer:test` from
the repo root.

- **Test pure helpers and behavior, not implementation.** Every new `.ts` helper
  with logic gets a spec.
- **Inject collaborators** (fetch, storage, clock) as parameters so specs do not
  need module mocks.
- `describe` names the unit; `it` titles read as a plain sentence about behavior
  (`it('returns nothing when no slot holds a session')`).
- A bug fix comes with a spec that fails before the fix.

## Checking

Before pushing, run what CI runs (`.github/workflows/developer.yml`), from
`projects/developer`:

```sh
deno fmt --check --config deno.json
deno task format:svelte:check
deno task check   # svelte-kit sync + svelte-check
deno task test
deno task build
```
