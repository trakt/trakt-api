![GitHub-Mark-Light](./logo_dark.svg#gh-dark-mode-only)
![GitHub-Mark-Dark](./logo_light.svg#gh-light-mode-only)

[![CI](https://github.com/trakt/trakt-api/actions/workflows/ci.yml/badge.svg)](https://github.com/trakt/trakt-api/actions/workflows/ci.yml)

At Trakt, we collect lots of interesting information about what tv shows and
movies everyone is watching. Part of the fun with such data is making it
available for anyone to mash up and use on their own apps. The **Trakt API** was
made just for this purpose. Let us know what you create!

## Project Structure

This [workspace](https://docs.deno.com/runtime/fundamentals/workspaces/)
contains multiple projects:

- **`api`:** Core library that implements Trakt API interactions using `ts-rest`
  and `zod` for type-safe communication and validation.
- **`playground`:** CLI project for testing and exploring the Trakt API
  functionality.
- **`developer`:** Trakt's developer portal at `developer.trakt.tv`, with 28
  Markdown guides in Getting Started and an interactive API Reference
  playground. Lives in `projects/developer`. See
  [local setup](projects/developer/README.md#run-locally) and
  [editing guides and navigation](projects/developer/README.md#getting-started-guides).
- **`openapi`:** Simple `hono` server that serves the API contract as an OpenAPI
  specification.

## Environment Variables

The following environment variables are required for the workspace to function
properly:

### Development

- **`TRAKT_CLIENT_ID`:** The client ID for the Trakt API.
- **`TRAKT_CLIENT_SECRET`:** The client secret for the Trakt API.
  - Required for the `playground` and `developer` projects.

The `developer` app also requires `DEVELOPER_SESSION_SECRET`. See its
[environment setup](projects/developer/README.md#run-locally).

### External Contribution - Unleash Your Inner Code Wizard!

Want to contribute to Trakt ? Here's how to set up your development environment:

1. **Create a Trakt Application:** Navigate to
   [Trakt Settings](https://app.trakt.tv/settings/apps) and create a new
   application.
1. Once your Trakt application is created, use the provided Client ID and Client
   Secret in your development environment.
1. Make use of the `playground` project to test out your changes by running
   `playground:dev`.

**A Word of Caution, Fellow Traveler:**

Please note that while using public applications is possible, they may have
certain API limitations:

- **Limited "Up Next" Access:** The "Up Next" endpoint might be unavailable or
  return incomplete data.

These restrictions are implemented as part of Trakt's API security measures to
prevent abuse from automated scrapers and unauthorized access.

## Getting Started

This is a Deno project, so you need to have Deno installed on your machine
please refer to the
[Deno installation guide](https://docs.deno.com/runtime/getting_started/installation/).
The `developer` app requires Deno 2.9.4 or later, with dependencies installed
separately using the task below.

1. **Clone the repository**
1. **Install dependencies:** `deno task install`
1. **Run tasks:**

- Workspace:
  - Format & Lint: `deno task format`

- Playground:
  - Development: `deno task playground:dev`

- Developer:
  - Install: `deno task developer:install`
  - Development: `deno task developer:dev`
  - Check: `deno task developer:check`
  - Test: `deno task developer:test`
  - Build: `deno task developer:build`
  - Configure its private `projects/developer/.env` first, as documented in that
    project's README. No other local application is required.

- OpenAPI:
  - Serve: `deno task openapi`
  - Development: `deno task openapi:dev`

## Questions & Bugs

Have questions or ideas? Share them in our
[**GitHub Discussions**](https://github.com/trakt/trakt-api/discussions).

Found a bug? Please report it in our
[**GitHub Issues**](https://github.com/trakt/trakt-api/issues).

## Third Party Libraries

All of the libraries listed below are user contributed. If you find a bug or
missing feature, please contact the developer directly. These might help give
your project a head start, but we can't provide direct support for any of these
libraries. Please help us keep this list up to date.

| Language     | Name           | Repository                                     |
| ------------ | -------------- | ---------------------------------------------- |
| C#           | Trakt.NET      | https://github.com/henrikfroehling/Trakt.NET   |
|              | TraktSharp     | https://github.com/wwarby/TraktSharp           |
| C++          | libtraqt       | https://github.com/RobertMe/libtraqt           |
| Clojure      | clj-trakt      | https://github.com/niamu/clj-trakt             |
| Go           | trakt-sync     | https://github.com/mfederowicz/trakt-sync      |
| Java         | trakt-java     | https://github.com/UweTrottmann/trakt-java     |
| Kotlin       | trakt-api      | https://github.com/MoviebaseApp/trakt-api      |
| Node.js      | Trakt.tv       | https://github.com/vankasteelj/trakt.tv        |
|              | TraktApi2      | https://github.com/PatrickE94/traktapi2        |
| Python       | trakt.py       | https://github.com/fuzeman/trakt.py            |
|              | pyTrakt        | https://github.com/moogar0880/PyTrakt          |
| R            | tRakt          | https://github.com/jemus42/tRakt               |
| React Native | nodeless-trakt | https://github.com/kdemoya/nodeless-trakt      |
| Ruby         | omniauth-trakt | https://github.com/wafcio/omniauth-trakt       |
|              | omniauth-trakt | https://github.com/alextakitani/omniauth-trakt |
| Swift        | TraktKit       | https://github.com/MaxHasADHD/TraktKit         |
|              | AKTrakt        | https://github.com/arsonik/AKTrakt             |
| TypeScript   | trakt-api      | https://github.com/trakt/trakt-api             |
