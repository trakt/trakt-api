---
updatedAt: 2026-07-08T09:54:32.000Z
---

# Extended Info

By default, all methods will return minimal info for movies, shows, episodes, people, and users. Minimal info is typically all you need to match locally cached items and includes the `title`, `year`, and `ids`.

However, you can request different extended levels of information by adding `?extended={level}` to the URL. Send a comma separated string to get multiple types of extended info.

> ### 🅽🅾🆃🅴
>
> *Extended responses can return a lot of extra data, so please only use extended parameters if you actually need them!*

| Level | Description |
| --- | --- |
| `full` | Expands the object returned by an endpoint, but list, activity, sync, and user-specific endpoints may include cached embedded media objects. If your app needs the freshest metadata, use the IDs returned by those endpoints and hydrate the item from the summary endpoint. See [Caching and Fresh Metadata](/?section=guides&guide=caching-and-fresh-data). |
| `images` | Compatibility option for endpoints that still document or support image-only expansion. Going forward, this will have no difference from `full` for image inclusion. |
| `full,images` | Compatibility option for older endpoint behavior. Prefer `full` unless an endpoint specifically documents otherwise. |
| `min` | A lower-level of minimal info where supported. |
| `metadata` | **Collection only.** Additional video and audio info. |
