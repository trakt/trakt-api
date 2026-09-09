---
updatedAt: 2026-07-02T12:07:20.000Z
---

# Website Media Links

There are several ways to construct direct links to media on the Trakt website. Trakt IDs are the best option when you need to link directly to a specific item, since they are stable and unambiguous. Slugs are better for user-facing links because they make URLs more readable and easier to share.

If you only have an external ID such as IMDb, TMDB, or TVDB, look up the item through the API first and use the returned Trakt id or slug to build the website link.

| Type      | URL                                       |
| --------- | ----------------------------------------- |
| `movie`   | `/movies/:slug`                           |
| `show`    | `/shows/:slug`                            |
| `season`  | `/shows/:slug/seasons/:num`               |
| `episode` | `/shows/:slug/seasons/:num/episodes/:num` |
| `person`  | `/people/:slug`                           |
| `comment` | `/comments/:id`                           |
| `list`    | `/lists/:id`                              |
