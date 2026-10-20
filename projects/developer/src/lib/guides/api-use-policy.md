---
updatedAt: 2026-10-20T00:00:00.000Z
---

# API Use Policy

The Trakt API helps developers build apps and tools that make Trakt more useful: discovering movies and shows, tracking what people watch, managing lists, and connecting their favorite experiences. We welcome integrations that support Trakt users and contribute to a healthy Trakt ecosystem.

What matters is how you use Trakt access and data. Bulk harvesting, resale, unauthorized redistribution, spam, and evading restrictions are not permitted.

You can use the Trakt API in free or paid apps, including apps supported by advertising, subscriptions, lifetime purchases, tips, or cosmetic purchases, provided your integration follows this policy.

Uses permitted by this policy do not require individual approval, written confirmation, or a separate commercial agreement before launch. Registering an API app does not mean Trakt has reviewed or endorsed your product. Endpoint access requirements and restrictions still apply.

## What is permitted?

You can build apps and tools that help people use Trakt or manage their own data. Examples include:

- A mobile, desktop, or web app for browsing movies and shows and managing a user's Trakt watch history, ratings, or lists.
- A media player integration that scrobbles playback to the user's connected Trakt account.
- A personal or self-hosted tool that syncs a user's media server activity with their own Trakt account.
- A Discord bot that shares a user's own activity where they have chosen to post it.
- A one-off personal script that helps a user export or migrate their own watch history, ratings, or lists.
- An app that displays public discovery information, such as trending titles.

An app's popularity, where it runs, or whether it uses a backend does not determine whether it is permitted. The same usage rules apply to personal tools and widely used apps. Caching and background updates are welcome when they support the features your users choose.

These uses must follow the requirements below. Access to Trakt data is not permission to sell it, distribute it as a dataset, or supply it to other services for their own use.

### Discovery, recommendations, and combined scores

Your app may display search results, title and person details, images, ratings, vote counts, and public discovery lists, including on pages that do not require sign-in. Label discovery lists accurately so users understand what they represent.

You may use related titles and other permitted API results to support recommendations within your app, including personalized recommendations based on titles a user follows or enjoys.

You may combine Trakt ratings with other sources into your own score. Clearly identify the contributing sources where the score is presented or explained, and label the result as your app's combined score rather than a Trakt rating.

These permissions cover features within your app. They do not permit bulk harvesting, catalog mirroring, or supplying feeds or datasets to other services.

## Standard and Premium access

Standard API access is free for commercial and noncommercial use. Commercial status, revenue, and user numbers alone do not require Premium, and Standard access has no per-user fee or revenue share.

[Premium](/docs/premium) provides higher rate limits, access to [Limited Access](/docs/limted-access) endpoints, and exemption from users' Community Apps limit. Standard apps count toward that limit. Choose the tier that supports the endpoints and request volume your app needs. Premium does not permit uses prohibited by this policy.

Developer Premium and [user VIP](/docs/vip-methods) are separate subscriptions. Creating an API app does not require VIP; it requires a verified GitHub account connected through the developer portal. See [Create an App](/docs/create-an-app) for registration requirements and the API reference for each endpoint's access requirements.

## What is not permitted?

- Scraping, bulk harvesting, or mirroring Trakt data to build a reusable copy of its catalog, community activity, ratings, or lists.
- Selling Trakt API access or datasets obtained through it.
- Redistributing Trakt data as a feed or dataset that other services use to populate their own catalogs, rankings, recommendations, or data products.
- Giving other services access to Trakt through your app's credentials.
- Posting unsolicited activity, comments, or other content, or using automation to manipulate ratings, likes, or other community activity.
- Working around rate limits, account restrictions, or a restriction placed on an integration.

Helping a user manage, share, or move their own data is different from collecting data across Trakt to supply another product. User authorization covers access to that user's account and the actions they choose. It does not grant permission to redistribute other users' data or Trakt's broader datasets.

### Examples at a glance

| Use case | Permitted? |
| --- | --- |
| A third-party app lets a user manage their Trakt watchlist. | Yes, subject to this policy. |
| That app caches data for the features its users use. | Yes, within the app's needs and access permissions. |
| A media player reports watched episodes to a connected Trakt account. | Yes, with the user's authorization. |
| A self-hosted tool syncs a user's media server activity with their own Trakt account. | Yes, with the user's authorization. |
| A Discord bot posts a user's own activity to a channel they choose. | Yes, without spam or unwanted posts. |
| A personal script migrates a user's own watch history to their account on another platform. | Yes, at the user's request. |
| A service collects Trakt community lists or ratings to supply another product or sell a data feed. | No. |
| An operator routes a blocked integration through replacement keys or credentials supplied by its users. | No. |

## Respect users and their data

Get user authorization before accessing protected account data or acting on someone's behalf. Access and keep only the data needed for the features the user has chosen, respect privacy and access restrictions, and stop accessing an account when authorization is withdrawn.

Keep credentials secure. Do not ask users to share their Trakt passwords or use another person's credentials to obtain access you are not entitled to.

Read the [Trakt Privacy Policy](https://app.trakt.tv/privacy) to understand how Trakt handles information. It does not cover your application's own data practices. Provide your own clear privacy information explaining what you collect, why you collect it, how long you keep it, and how users can disconnect and request deletion.

### Imports, exports, and sync

Helping a user import, export, or migrate their own Trakt history, ratings, or lists at their request is permitted. For one-time imports, we recommend supporting the user's [Trakt data export](https://app.trakt.tv/settings/data).

Use [OAuth](/docs/authentication-oauth) when accessing protected account data or acting on a user's behalf. Two-way sync is encouraged where appropriate, but is not a condition of permission for a one-time import.

## Caching and images

Cache API responses and images to avoid repeated requests. You may cache data on users' devices or on a backend supporting your app's features.

Images returned by the API may be displayed in free and paid apps and must be cached. There is no fixed maximum cache duration or required refresh interval under this policy. Keep collection and refresh activity proportionate to features people actually use, and respect API limits. See [Caching and Fresh Data](/docs/caching-and-fresh-data) for guidance on keeping metadata current.

Caching does not permit building a reusable copy of Trakt's catalog or continuing to use Trakt-sourced catalog metadata and artwork after your integration ends. This restriction concerns Trakt-supplied catalog content, not users' own watch history, ratings, or lists, or content independently obtained from another source. API access does not grant ownership of images or other third-party content.

## Use the API fairly

The API is shared by many apps and their users. Keep your usage proportionate to the features people actually use:

- Use documented API features and respect rate limits and account or feature restrictions.
- Reuse data where appropriate and avoid repeatedly requesting information you already have.
- Keep background activity proportionate to users' needs and address excessive traffic promptly.
- Do not scrape the website or create additional API apps to evade limits.

Staying below a rate limit does not make a prohibited use permitted.

Requests may come directly from users' devices or from your app's backend. See [Rate Limits](/docs/rate-limiting) for how limits are scoped and how to handle `429` responses.

## Keep your app active

We will automatically delete API app registrations after 30 consecutive days with no usage. Registrations that have only been used for testing during their first 30 days will also be deleted. This keeps unused registrations from accumulating and helps us support apps that people use.

A personal tool in regular use counts as an active app, even if it serves only one person. Having a single user does not, by itself, make an app a test app.

Deletion removes the app's API access, not the owner's Trakt account or watch history. Keep your developer contact details current so we can reach you about your app.

## Follow Trakt's terms and branding requirements

This policy covers developers' and integrators' use of the Trakt API, including the commercial uses described above. The general [Terms of Use](https://app.trakt.tv/terms) cover use of Trakt's user-facing services. Your Trakt account remains subject to the Terms of Use. This policy does not grant ownership of Trakt data, content, or trademarks. Do not use Trakt data in applications or websites that promote copyright infringement or piracy.

Include "[App name] uses Trakt but is not endorsed or certified by Trakt" in your app's About, Settings, or equivalent information page and in its app-store description, where applicable. For a website, use an equivalent About or credits page.

You do not need a separate credit beside every item of Trakt data.

Using the Trakt logo is optional. If you use it, follow the [Trakt Branding Guide](https://app.trakt.tv/branding): use the approved assets without modifying them, keep the required clear space, and do not incorporate the Trakt logo into your own identity or imply Trakt sponsorship or endorsement.

## Availability and changes

The API is provided as-is, with no warranty. Rate limits, features, endpoints, and access may change at any time, without a guaranteed notice or transition period.

## Access restrictions and circumvention

If an integration does not follow this policy, we will normally contact its developer, explain the issue, and give them a reasonable opportunity to address it before restricting access. We may restrict, suspend, or revoke access immediately for abuse or when needed to protect Trakt or its users.

Operators must not work around a restriction by continuing the affected integration through replacement apps, keys, accounts, credentials supplied by users, or third parties. Renaming or repackaging the same integration does not restore permission to use the API. This rule targets evasion of a restriction; using your own credentials for an otherwise permitted personal or self-hosted tool is allowed.

## Building your integration

If your integration follows this policy, you can proceed without requesting individual confirmation. The examples illustrate permitted uses; they are not an exhaustive list.

Start with [Create an App](/docs/create-an-app), then check the API reference, [Rate Limits](/docs/rate-limiting), [Premium](/docs/premium), and [Branding Guide](https://app.trakt.tv/branding) for implementation and access requirements.

This policy does not authorize prohibited uses, bypass endpoint restrictions, or override a restriction placed on an integration.

Keep your developer contact details current. Use the [GitHub developer discussions](https://github.com/trakt/trakt-api/discussions) for technical API questions, reproducible problems, and API announcements.
