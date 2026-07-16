---
trigger: glob
globs: '**'
description: 'Core project overview, structure, tooling, and commit standards for the trakt-api monorepo. Apply to all files.'
applyTo: '**'
---

# Project Guidelines

## Tech Stack

Deno workspace (monorepo). TypeScript. The publishable artifact is `@trakt/api`
in `projects/api/` - a fully typed [ts-rest](https://ts-rest.com) contract +
client for the Trakt API, backed by Zod schemas, published to
[JSR](https://jsr.io/@trakt/api).

## Project Structure

```
projects/
  api/              # @trakt/api - the published package
    mod.ts          # published entry (facade: runtime from src, types from ./types)
    src/            # implementation: contracts, schemas, client
      index.ts      # barrel + client (traktApi, traktApiFactory)
      contracts/    # one dir per domain (movies, shows, users, ...)
        _internal/  # shared schemas, builder, request/response building blocks
        traktContract.ts  # aggregate contract of all domains
    types/          # GENERATED static .d.ts (gitignored, built before publish)
    scripts/        # build tooling (build-types.ts)
  openapi/          # generates OpenAPI from the contract (runtime consumer)
  playground/       # local scratch client
```

## Tooling

- `deno task install` - frozen install (matches lockfile; run before CI work).
- `deno fmt` / `deno lint` - formatting and lint (config in root + api
  deno.json).
- `deno task openapi:validate` - validates the generated OpenAPI.
- `cd projects/api && deno task test` - package tests.
- Never hand-edit `deno.lock` for build-only deps; `build:types` runs with
  `--no-lock` so it never dirties it.

## Commit Standards

- **Conventional Commits** (enforced by commitlint on PRs): `feat:`, `fix:`,
  `chore:`, `docs:`, `refactor:`, `test:`, `perf:`. Scope with `(api)` when the
  change is in the package, e.g. `feat(api): add smart lists endpoints`.
- **Version bumps are their own `chore(api): bump ...` commit.** JSR versions
  are immutable - every publish needs a new version.
- **No `Co-Authored-By` trailers**, no "generated with" footers.
- **No em-dashes or en-dashes** in commit messages, PR bodies, or review
  replies - plain hyphens only.

## Branching and PRs

- Never commit to `master`. Branch first, open a PR, let CI gate it.
- Keep the PR description in sync with the branch as scope changes.
- Address review feedback by amending the origin commit (fixup + autosquash),
  not by stacking "address review" commits.

## Tone

Direct, concise, technical. State assumptions before non-trivial changes.
Surgical diffs - every changed line traces to the request; do not "improve"
adjacent code. Match existing style even if you would do it differently.
