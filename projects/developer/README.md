# Trakt Developer Portal

A SvelteKit application for reading Trakt API guides, exploring endpoints, and
trying authenticated requests. It uses Svelte, TypeScript, and SCSS, with Deno
for dependency management and development tasks.

- **Getting Started** presents local Markdown guides in a grouped sidebar with
  an article reader. The first guide is selected by default. Articles have
  direct links and a formatted last-edited date.
- **API Reference** provides searchable endpoint documentation and a request
  playground backed by [`static/openapi.json`](static/openapi.json). It supports
  editable parameters, headers, and JSON bodies; public and premium servers;
  connected accounts; and expected and live response inspection.

## Run locally

Use Deno 2.9.4, the version used by CI, or later. Run these commands from
`projects/developer`:

```sh
deno install --allow-scripts --frozen
cp .env.example .env
```

Install the root workspace too, with `deno task install` from the repository
root. The OpenAPI document is generated from the contract before every `dev` and
`build`, and generation runs there.

Set `PUBLIC_TRAKT_CLIENT_ID` in `.env` to your Trakt application's client id,
then register `http://localhost:5174/callback` as a redirect URI on that
application.

```sh
deno task dev:local
```

Open [localhost:5174](http://localhost:5174). In API Reference, use
**Environment** to connect a Trakt account and choose a server. The redirect URI
must match the registered one exactly, including the hostname and port.

This directory is a standalone Deno workspace with its own `deno.lock`.
Dependencies are installed here. From the repository root, the equivalent setup
and development tasks are `deno task developer:install` and
`deno task developer:dev`.

## Configuration

There is one setting, listed in [`.env.example`](.env.example).

| Variable                 | Purpose                                                      |
| ------------------------ | ------------------------------------------------------------ |
| `PUBLIC_TRAKT_CLIENT_ID` | Identifies the Trakt application for API requests and OAuth. |

It is read at build time through `$env/static/public` and ships in the browser
bundle, which is why it carries the `PUBLIC_` prefix. There is no secret to
configure: the portal is a public OAuth client.

## Deployment

The static build in `build/` is published to
[developer.trakt.tv](https://developer.trakt.tv) from GitHub Pages by the
[Developer workflow](../../.github/workflows/developer.yml) on pushes to master.
`static/CNAME` carries the domain and `.nojekyll` stops Pages from processing
the output.

Deploying needs three things set up once: Pages enabled on the repository, a DNS
record for the domain, and `https://developer.trakt.tv/callback` registered as a
redirect URI on the Trakt application. The client id comes from the
`PUBLIC_TRAKT_CLIENT_ID` repository variable.

## Maintain the guides

Articles live in [`src/lib/guides/`](src/lib/guides/) and are bundled with the
application. Edit [`contents.md`](src/lib/guides/contents.md) to control sidebar
groups, labels, and ordering. Use level-two headings for groups and Markdown
list links for their entries:

```md
## Start here

- [Introduction](/?section=guides&guide=getting-started)
- [Authentication](/?section=guides&guide=authentication-oauth)
```

To add an article, create `<slug>.md` in that directory and add its link to
`contents.md`. Begin with an ISO timestamp and a level-one heading:

```md
---
updatedAt: 2026-09-09T12:00:00.000Z
---

# Article title

Article content.
```

Set `updatedAt` to the last content edit. The footer displays a relative label
such as “Updated about 1 month ago” alongside the readable date. Missing or
invalid timestamps omit the footer.

The reader supports headings, lists, code blocks, and horizontally scrollable
tables. Frontmatter is hidden, raw HTML is escaped, and Markdown images display
their alternative text. Write links and tables using standard Markdown syntax.

Use `/?section=guides&guide=<slug>` for guide links. For API operations, use the
`operationId` from the OpenAPI document:

```md
[Exchange a token](/?section=reference&operation=postOauthToken)
```

**Copy operation link** in the request actions menu creates this URL without
request inputs. Matching documentation operation links in guides also resolve to
the local API Reference.

## Maintain API Reference

`static/openapi.json` is generated, not edited. Change the endpoint catalog,
parameter definitions, descriptions, or response schemas in the ts-rest contract
under `projects/api/src/contracts/`. The app loads the generated document and
parses it with the utilities in [`src/lib/openapi/`](src/lib/openapi/).

`deno task dev` and `deno task build` regenerate it first, so it tracks the
contract automatically. Run `deno task generate:openapi` to refresh it on its
own. Generation runs the root `openapi:generate` task, so the root workspace
must be installed.

The playground offers request validation, method-and-URL and cURL copying,
bookmarkable request configuration, and session response history. The response
inspector displays status, headers, JSON bodies, and minimum or full expected
response samples. Connected accounts support refresh and logout.

## Icons and share cards

`static/` carries the icon set (`favicon.svg`, `favicon.ico`,
`apple-touch-icon.png`) and five Open Graph cards in `static/og/`, all derived
from the logomark and the reference's own method colours.

Page metadata lives in [`src/app.html`](src/app.html), not in a `<svelte:head>`
block. With `ssr = false` everything in `<svelte:head>` renders after hydration,
and link unfurlers do not run JavaScript, so anything placed there is invisible
to them. `app.html` is the prerendered shell that actually ships.

Regenerate the cards after a design change:

```sh
deno task generate:share-cards
```

It renders each card through headless Chrome, then runs `pngquant` and `oxipng`
to cut them from roughly 40 kB to 10 kB at 50 dB PSNR. It needs all three
installed (`brew install oxipng pngquant`), and honours `CHROME_PATH` if Chrome
is not at the default macOS location. The cards are committed, so this only runs
when the design changes. Compare the output against the previous cards before
committing; `magick compare -metric PSNR` quantifies it.

`scripts/set-share-card.mjs` runs after every build and points `og:image` at one
of the five, chosen from the commit SHA, with the revision appended as a `?v=`
query. The card rotates per deploy rather than per share, because `og:image` is
a static URL and there is no server to vary it per request.

The query is doing real work. Unfurlers cache by image URL, and the filename
alone only has five possible values, so cache keys would start repeating after
the fifth deploy. Appending the revision makes every deploy a new key.

The card copy deliberately carries no endpoint count. Cards are rasterized and
committed, and the build never re-renders them, so any figure baked into the
image would silently go stale the next time the contract changes.

## Authentication and credential handling

The portal has no server. Sign-in is the OpenID Connect authorization code flow
with PKCE, run in the browser by `oidc-client-ts` against `auth.trakt.tv`, which
accepts public clients. `src/lib/auth/` holds one user manager per account slot,
and `/callback` completes the redirect. There is no client secret anywhere,
because the flow does not need one.

Requests go straight from the browser to the Trakt API, which answers
cross-origin. [`executeApiRequest`](src/lib/api/executeApiRequest.ts) restricts
destinations to approved HTTPS Trakt hosts, sets the managed `trakt-api-key`,
`trakt-api-version` and `authorization` headers so a caller cannot override
them, and never attaches an account token to an OAuth endpoint.

Because the browser can only read CORS-exposed response headers, the inspector
shows the Trakt ones (pagination, rate limit, retry) but not `etag`, `date`,
`server` or `content-length`.

Tokens live in `localStorage`, which is readable by any script running on the
page. The strict content security policy in
[`svelte.config.js`](svelte.config.js) is what keeps foreign script off it.
GitHub Pages cannot send response headers, so the policy is delivered as a
`<meta>` tag, and `frame-ancestors` does not apply in that form.

Credential fields are redacted from displayed responses and sensitive fields are
removed from shared request configuration. Response history stays in browser
session storage. Review copied requests or responses before sharing them.

## Project layout

| Path                            | Contents                                                           |
| ------------------------------- | ------------------------------------------------------------------ |
| `src/lib/guides/`               | Markdown articles, sidebar contents, and guide parsing.            |
| `src/lib/features/developer/`   | Portal layout, navigation, request editor, and response inspector. |
| `src/lib/markdown/`             | Markdown rendering.                                                |
| `src/lib/openapi/`              | Endpoint catalog parsing and URL construction.                     |
| `src/lib/api/`                  | Request execution, account helpers, and response redaction.        |
| `src/lib/auth/`                 | OIDC sign-in, refresh, logout, and token storage.                  |
| `src/routes/`                   | Portal page and the OAuth callback.                                |
| `src/style/`                    | Shared styles and design tokens.                                   |
| `src/style/numeric-increments/` | Spacing scale copied from trakt-web; match tokens on value.        |
| `static/`                       | Generated OpenAPI document, icons, and share cards.                |
| `scripts/`                      | OpenAPI generation, share cards, and the per-deploy card pick.     |

## Validation

Run from this directory:

```sh
deno fmt --check --config deno.json
deno task format:svelte:check
deno task check
deno task test
deno task build
```

`deno fmt` does not read `.svelte` files, so Prettier with
`prettier-plugin-svelte` formats them instead; run `deno task format:svelte` to
apply it. `check` validates TypeScript and Svelte components. `test` runs
Vitest, including guide coverage, Markdown rendering, request state, account
handling, and request execution. `build` regenerates the OpenAPI document and
produces the static site in `build/`. Use `deno task preview` to inspect it
locally.

The [Developer workflow](../../.github/workflows/developer.yml) runs these
checks with a frozen dependency install, then deploys from master. Root aliases
are `developer:check`, `developer:test`, and `developer:build`.
