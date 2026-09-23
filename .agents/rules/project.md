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
  developer/        # SvelteKit developer portal (own deno.json, not in the workspace)
```

## Tooling

- `deno task install` - frozen install (matches lockfile; run before CI work).
- `deno fmt` / `deno lint` - formatting and lint (config in root + api
  deno.json).
- `deno task openapi:validate` - validates the generated OpenAPI.
- `cd projects/api && deno task test` - package tests.
- Never hand-edit `deno.lock` for build-only deps; `build:types` runs with
  `--no-lock` so it never dirties it.

## Restrictions

Hard limits for every contributor, human or agent. Ask before crossing one.

- **Never edit generated output.** `projects/api/types/` (built by
  `build:types`), `projects/developer/static/openapi.json` (built by
  `generate:openapi`), and `.svelte-kit/` are regenerated from source. Change
  the source and rerun the generator.
- **Never hand-edit `deno.lock`.** Change dependencies through `deno add` /
  `deno install` so the lockfile stays consistent with `--frozen` installs in
  CI.
- **No new dependencies without asking.** Every dependency of `@trakt/api` ships
  to consumers; every dependency of the portal ships to the browser.
- **Do not touch the publish flow** (`.github/workflows/publish.yml`, version
  fields, provenance settings) unless the task is about publishing. See
  `jsr.md`.
- **No secrets in the repo.** The portal is a public OAuth client; only
  `PUBLIC_*` build-time values exist, and they ship in the bundle.
- **Public repo.** Do not reference private repositories, internal services, or
  internal tickets in code, commits, or PR text.
- **Do not weaken checks to go green.** No skipped tests, lint suppressions for
  rules that catch real bugs, `any`, or loosened compiler options. Fix the code.

## Rule Files

Rules live in `.agents/rules/` and are shared by every agent: Claude Code
(`CLAUDE.md` / `AGENTS.md`), Codex (`AGENTS.md`), Copilot
(`.github/instructions/*.instructions.md` symlinks), and the review bot
(`.gemini/styleguide.md`).

- Frontmatter values (`globs`, `applyTo`, `description`) use **single quotes**,
  never double. Every file keeps both `globs` and `applyTo` (Copilot reads
  `applyTo`).
- A new rule file needs a routing line in `CLAUDE.md` and `AGENTS.md`, a symlink
  in `.github/instructions/`, and its reviewable rules summarized in
  `.gemini/styleguide.md`.
- When you establish a pattern that diverges from or extends these rules, update
  the matching rule file in the same PR.

## Commit Standards

- **Conventional Commits** (enforced by commitlint on PRs): `feat:`, `fix:`,
  `chore:`, `docs:`, `refactor:`, `test:`, `perf:`. Scope with `(api)` when the
  change is in the package, e.g. `feat(api): add smart lists endpoints`, and
  with `(developer)` when it is in the portal.
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
