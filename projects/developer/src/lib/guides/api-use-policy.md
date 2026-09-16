---
updatedAt: 2026-09-16T00:00:00.000Z
---

# API Use Policy

The Trakt API is intended for third-party client applications that help people use Trakt: discover movies and shows, track what they watch, manage lists, and interact with their Trakt accounts. We welcome developers who build these experiences responsibly.

Service-to-service integrations are not permitted. The distinction depends on what your integration does with Trakt access and data, not simply whether requests come from a device or a server.

## What is permitted?

A **client application** provides an interface or tool through which people use Trakt's features and data. Examples include:

- A mobile, desktop, or web app for browsing movies and shows and managing a user's Trakt watch history, ratings, or lists.
- A media player integration that scrobbles playback to the user's connected Trakt account.
- A personal tool that helps a user view or manage their own Trakt data.
- A client app that displays public discovery information, such as trending titles, using documented endpoints that do not require user authentication.

These uses must follow the requirements below. An API key or a successful request does not, by itself, authorize every use of the data returned.

### Can a client app have a backend?

Yes. A client app may use its own backend for functions such as secure authentication, caching, or background updates needed to provide its Trakt features. Requests do not all have to originate from the user's device or follow an immediate tap or click.

That backend must serve the client application's Trakt experience. It must not turn Trakt into a data supplier for a separate service, distribute API access to other services, or maintain an independent dataset for unrelated uses.

## What is not permitted?

A **service-to-service integration** uses Trakt as an upstream provider to populate, enrich, synchronize, or operate a separate service's own data or offering, rather than providing a client experience for using Trakt.

Examples include:

- Feeding Trakt lists, ratings, activity, or discovery data into another service's own catalog, rankings, recommendation engine, or data products.
- Continuously synchronizing Trakt account data into a separate tracking or list platform's own accounts and database.
- Offering a proxy, API wrapper, or data feed that gives other services access to Trakt data through your credentials.
- Scraping, bulk harvesting, or mirroring Trakt data to build or maintain an independent database.
- Selling or redistributing Trakt API access or datasets obtained through it.

A user-facing website, a “Connect Trakt” button, or a user's OAuth authorization does not automatically make an integration a permitted client app. User authorization allows access to that user's account; it does not waive restrictions on what your service may do with that access.

### Examples at a glance

| Use case | Permitted? |
| --- | --- |
| A third-party app lets a user manage their Trakt watchlist. | Yes, subject to this policy. |
| That app's backend caches responses for its Trakt interface. | Yes, within the app's needs and access permissions. |
| A media player reports watched episodes to a connected Trakt account. | Yes, subject to user authorization and fair use. |
| A separate platform imports Trakt lists to power its own list service. | No, this is service-to-service use. |
| A service collects Trakt ratings to sell a data feed to other businesses. | No. |
| A blocked integration resumes through replacement keys or user-supplied credentials. | No. |

## Respect users and their data

Use Trakt's documented authorization flows when accessing protected account data or acting on a user's behalf. Request and retain only the data needed for the features the user has chosen, respect account privacy and access restrictions, and stop accessing an account when authorization is withdrawn.

Protect client secrets and access tokens. Do not ask users to share their Trakt passwords or use another person's credentials to obtain access you are not entitled to.

Read the [Trakt Privacy Policy](https://app.trakt.tv/privacy) to understand how Trakt handles information. It does not cover your application's own data practices. Provide your own clear privacy information explaining what you collect, why you collect it, how long you keep it, and how users can disconnect and request deletion.

## Use the API fairly

Permitted applications must also use shared API resources responsibly:

- Use documented endpoints and respect pagination, rate limits, and account or feature restrictions.
- Cache appropriately, fetch only what is needed, and prefer incremental updates over repeatedly downloading complete datasets.
- Refresh at intervals appropriate to the data and the user's needs.
- Handle failures and rate-limit responses with backoff instead of repeated immediate retries.
- Monitor your application's traffic and correct excessive or malformed requests.
- Do not scrape the website or create additional API apps to evade limits.

See the [Trakt Fair Use Policy](https://forums.trakt.tv/t/draft-trakt-fair-use-policy-feedback-welcome/100842). Staying below a rate limit does not make a prohibited use permitted.

## Follow Trakt's terms and branding requirements

Read and follow the [Trakt Terms of Use](https://app.trakt.tv/terms) alongside this API guidance. This page does not replace those terms or grant ownership of Trakt data, content, or trademarks. Do not use Trakt data in applications or websites that promote copyright infringement or piracy.

Follow the [Trakt Branding Guide](https://app.trakt.tv/branding) when identifying your integration with Trakt. Use the approved assets without modifying them, keep the required clear space, and do not incorporate the Trakt logo into your own identity or imply Trakt sponsorship or endorsement.

## Access restrictions and circumvention

Trakt may review an integration's purpose and usage and restrict, suspend, or revoke API access for prohibited use, abuse, or failure to follow applicable requirements. Where appropriate, we may request changes to an integration. Access may be restricted immediately when needed to protect Trakt or its users.

An access restriction applies to the affected integration and its operator, not only to the API key that was blocked. You must not continue the restricted integration through replacement apps, keys, accounts, user-supplied credentials, intermediaries, or third parties. Renaming or repackaging the same integration does not restore permission to use the API.

## Unsure whether your integration is permitted?

Contact [Trakt support](mailto:support@trakt.tv) before building or launching an integration whose use falls outside the client-app examples above. Describe what your product does, whose data it accesses, where that data is stored, and whether it is made available to another service. A request for clarification does not authorize a prohibited use.

Keep your developer contact details current and follow [Trakt API discussions and announcements](https://github.com/trakt/trakt-api/discussions) for updates.
