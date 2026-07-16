Before implementing anything, identify which area you are working in and read
the corresponding rule file from `.agents/rules/` (only the core rules auto-load
via AGENTS.md; domain rules load on demand):

- Published package (`projects/api/**`): read `jsr.md` - keeps the `@trakt/api`
  JSR score at 100 (static types, symbol docs, provenance publishing).
- Contract schemas (`projects/api/src/contracts/**`): also read `schemas.md`.
- Everything else: `project.md` (always-on baseline, already loaded as core).

@AGENTS.md
