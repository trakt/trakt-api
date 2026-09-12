---
updatedAt: 2026-07-08T09:51:14.000Z
---

# Caching and Fresh Data

Trakt API responses generally contain two different kinds of data:

* **Metadata**, such as titles, overviews, taglines, images, translations, ratings, IDs, genres, and `updated_at`.
* **Activity or user-specific data**, such as watched state, favorites, plays, list counts, progress, and other counts.

These two data types are cached and updated differently.

## Summary endpoints are the source of truth for metadata

For the freshest metadata, use the dedicated summary endpoints:

* `GET /movies/{id}?extended=full`
* `GET /shows/{id}?extended=full`
* `GET /shows/{id}/seasons/{season}/episodes/{episode}?extended=full`

These endpoints should be treated as the canonical source for current metadata fields like `overview`, `tagline`, `available_translations`, images, social IDs, ratings data, comments, and `updated_at`.

## List, activity, and sync endpoints may return cached snapshots

Some endpoints return media objects nested inside a larger response. For example:

* `GET /movies/anticipated`
* `GET /movies/watched/{period}`
* `GET /movies/played/{period}`
* `GET /movies/collected/{period}`
* `GET /movies/favorited/{period}`
* `GET /sync/watched/{type}`
* `GET /sync/collection/{type}`
* user history, collection, ratings, favorites, and watchlist endpoints

These endpoints are optimized for the list, activity, sync, or user-specific data they return. Any nested `movie`, `show`, `season`, or `episode` object should be treated as a convenience snapshot for matching and display, not as the freshest metadata record.

Even when `extended=full` is supported, the embedded object might not be updated at the exact same time as the corresponding summary endpoint.

## Recommended client pattern

Use activity and sync endpoints to get IDs and user-specific state.

Then, when you need current metadata, hydrate those items separately from the summary endpoints.
