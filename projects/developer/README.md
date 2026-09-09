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

Fill in `.env` using the configuration below. Generate a session secret with
`openssl rand -hex 32`, then register `http://localhost:5174/auth/callback` as a
redirect URI in your Trakt application.

```sh
deno task dev:local
```

Open [localhost:5174](http://localhost:5174). In API Reference, use
**Environment** to connect a Trakt account and choose a server. The OAuth
callback must match the registered URL exactly, including the hostname and port.

This directory is a standalone Deno workspace with its own `deno.lock`.
Dependencies are installed here. From the repository root, the equivalent setup
and development tasks are `deno task developer:install` and
`deno task developer:dev`.

## Configuration

Copy the names from [`.env.example`](.env.example). Values are read on the
server; do not prefix them with `PUBLIC_` or `VITE_`.

| Variable                   | Purpose                                                                |
| -------------------------- | ---------------------------------------------------------------------- |
| `TRAKT_CLIENT_ID`          | Identifies the Trakt application for API requests and OAuth.           |
| `TRAKT_CLIENT_SECRET`      | Authenticates the application during OAuth token exchange.             |
| `DEVELOPER_SESSION_SECRET` | Encrypts account sessions; requires at least 32 characters.            |
| `DEVELOPER_ORIGIN`         | Public HTTPS origin for deployment. Leave unset for local development. |

The application uses the Cloudflare adapter configured in
[`svelte.config.js`](svelte.config.js) and [`wrangler.jsonc`](wrangler.jsonc).
For deployment, supply the server configuration above, set
`DEVELOPER_ORIGIN=https://developer.trakt.tv`, and register
`https://developer.trakt.tv/auth/callback` in the Trakt application.

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

Update [`static/openapi.json`](static/openapi.json) to change the endpoint
catalog, parameter definitions, descriptions, or response schemas. The app loads
this file and parses it with the utilities in
[`src/lib/openapi/`](src/lib/openapi/).

The playground offers request validation, method-and-URL and cURL copying,
bookmarkable request configuration, and session response history. The response
inspector displays status, headers, JSON bodies, and minimum or full expected
response samples. Connected accounts support refresh and logout.

## Server and credential handling

Requests run through the server proxy in
[`src/routes/api/execute/+server.ts`](src/routes/api/execute/+server.ts). It
restricts destinations to approved HTTPS Trakt hosts and injects managed
credentials. Client secrets, session keys, and account tokens stay on the
server. The OAuth client ID is public and appears in authorization redirects.

Account sessions use AES-GCM encryption in HttpOnly cookies, marked Secure over
HTTPS. The browser receives account display metadata. Credential fields are
redacted from proxy responses and sensitive fields are removed from shared
request configuration. Response history remains in browser session storage. Keep
`.env` private and review copied requests or responses before sharing them.

## Project layout

| Path                            | Contents                                                           |
| ------------------------------- | ------------------------------------------------------------------ |
| `src/lib/guides/`               | Markdown articles, sidebar contents, and guide parsing.            |
| `src/lib/features/developer/`   | Portal layout, navigation, request editor, and response inspector. |
| `src/lib/markdown/`             | Markdown rendering.                                                |
| `src/lib/openapi/`              | Endpoint catalog parsing and URL construction.                     |
| `src/lib/api/`                  | Browser-side account and request helpers.                          |
| `src/lib/server/`               | OAuth, session encryption, and response redaction.                 |
| `src/routes/`                   | Portal page, OAuth routes, and API handlers.                       |
| `src/style/`                    | Shared styles and design tokens.                                   |
| `src/style/numeric-increments/` | Spacing scale copied from trakt-web; match tokens on value.        |
| `static/`                       | OpenAPI document and public assets.                                |
| `scripts/`                      | Browser-bundle credential checks.                                  |

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
Vitest, including guide coverage, Markdown rendering, request state, OAuth, and
proxy tests. `build` produces the application and checks browser output for
private credential bindings and configured secret values. Use
`deno task preview` to inspect the built application locally.

The [Developer workflow](../../.github/workflows/developer.yml) runs these
checks with a frozen dependency install. Root aliases are `developer:check`,
`developer:test`, and `developer:build`.
