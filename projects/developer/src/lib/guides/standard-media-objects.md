---
updatedAt: 2026-07-08T09:56:00.000Z
---

# Standard Media Objects

All methods will accept or return standard media objects for `movie`, `show`, `season`, `episode`, `person`, and `user` items.

Here are examples for all **minimal** objects. You can get more information using [Extended Info](/?section=guides&guide=extended-info). Some endpoints return media objects as embedded snapshots inside list, activity, sync, or user-specific responses. Use the `ids` object to match or hydrate the item from its summary endpoint when you need fresh metadata. See [Caching and Fresh Metadata](/?section=guides&guide=caching-and-fresh-data).

#### Movie

```json movie
{
    "title": "Batman Begins",
    "year": 2005,
    "ids": {
        "trakt": 1,
        "slug": "batman-begins-2005",
        "imdb": "tt0372784",
        "tmdb": 272
    }
}
```

#### Show

```json show
{
    "title": "Breaking Bad",
    "year": 2008,
    "ids": {
        "trakt": 1,
        "slug": "breaking-bad",
        "tvdb": 81189,
        "imdb": "tt0903747",
        "tmdb": 1396
    }
}
```

#### Season

```json season
{
    "number": 0,
    "ids": {
        "trakt": 1,
        "tvdb": 439371,
        "tmdb": 3577
    }
}
```

#### Episode

```json episode
{
    "season": 1,
    "number": 1,
    "title": "Pilot",
    "ids": {
        "trakt": 16,
        "tvdb": 349232,
        "imdb": "tt0959621",
        "tmdb": 62085
    }
}
```

#### Person

A Person is used to describe a **cast** and/or **crew** member of a media.

```json person
{
    "name": "Bryan Cranston",
    "ids": {
        "trakt": 142,
        "slug": "bryan-cranston",
        "imdb": "nm0186505",
        "tmdb": 17419
    }
}
```

#### User

A user is used to describe a Trakt user.

```json user
{
    "username": "sean",
    "private": false,
    "name": "Sean Rudford",
    "vip": true,
    "vip_ep": true,
    "ids": {
        "slug": "sean"
    }
}
```
