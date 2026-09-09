---
updatedAt: 2026-06-19T08:23:49.000Z
---

# Images

#### Trakt Images

Trakt can return images for `movie`, `show`, `season`, `episode`, and `person` objects. Request `?extended=full` to have image data included in the `images` object when available.

Some endpoint might still list and/or need the legacy deprecated `extended=images` or `extended=full,images`. Going forward, `full` and `images` will have no difference for image inclusion, so `extended=full` is the preferred option.

> ### ☣️ 🅸🅼🅿🅾🆁🆃🅰🅽🆃
>
> **Please cache all images!** All images are required to be cached in your app or server and not loaded directly from our CDN. Hotlinking images is not allowed and will be blocked.
>
> ### 🅽🅾🆃🅴
>
> All images are returned in WebP format for reduced file size, at the same image quality. You'll also need to prepend the https\:// prefix to all image URLs.

### Example Images Object

```json
{
  "title": "TRON: Legacy",
  "year": 2010,
  "ids": {
    "trakt": 12601,
    "slug": "tron-legacy-2010",
    "imdb": "tt1104001",
    "tmdb": 20526
  },
  "images": {
    "fanart": [
      "walter-r2.trakt.tv/images/movies/000/012/601/fanarts/medium/5aab754f58.jpg.webp"
    ],
    "poster": [
      "walter-r2.trakt.tv/images/movies/000/012/601/posters/thumb/e0d9dd35c5.jpg.webp"
    ],
    "logo": [
      "walter-r2.trakt.tv/images/movies/000/012/601/logos/medium/dbce70b4aa.png.webp"
    ],
    "clearart": [
      "walter-r2.trakt.tv/images/movies/000/012/601/cleararts/medium/513a3688d1.png.webp"
    ],
    "banner": [
      "walter-r2.trakt.tv/images/movies/000/012/601/banners/medium/71dc0c3258.jpg.webp"
    ],
    "thumb": [
      "walter-r2.trakt.tv/images/movies/000/012/601/thumbs/medium/fcd7d7968c.jpg.webp"
    ]
  }
}
```

#### External Images

If you want more variety of images, there are several external services you can use. The standard Trakt media objects for all `movie`, `show`, `season`, `episode`, and `person` items include an `ids` object. These `ids` map to other services like [TMDB](https://www.themoviedb.org), [TVDB](https://thetvdb.com), [Fanart.tv](https://fanart.tv), [IMDB](https://www.imdb.com), and [OMDB](https://www.omdbapi.com/).

Most of these services have free APIs you can use to grab lots of great looking images. Here’s a chart to help you find the best artwork for your app. [**We also wrote an article to help with this.**](https://medium.com/api-news/how-to-find-the-best-images-516045bcc3b6)

| Media      | Type         | [TMDB](https://developers.themoviedb.org/3) | [TVDB](https://api.thetvdb.com/swagger) | [Fanart.tv](http://docs.fanarttv.apiary.io) | [OMDB](https://www.omdbapi.com) |
| ---------- | ------------ | ------------------------------------------- | --------------------------------------- | ------------------------------------------- | ------------------------------- |
| `shows`    | `poster`     | ✓                                           | ✓                                       | ✓                                           | ✓                               |
|            | `fanart`     | ✓                                           | ✓                                       | ✓                                           |                                 |
|            | `banner`     |                                             | ✓                                       | ✓                                           |                                 |
|            | `logo`       | ✓                                           |                                         | ✓                                           |                                 |
|            | `clearart`   |                                             |                                         | ✓                                           |                                 |
|            | `thumb`      |                                             |                                         | ✓                                           |                                 |
| `seasons`  | `poster`     | ✓                                           | ✓                                       | ✓                                           |                                 |
|            | `banner`     |                                             | ✓                                       | ✓                                           |                                 |
|            | `thumb`      |                                             |                                         | ✓                                           |                                 |
| `episodes` | `screenshot` | ✓                                           | ✓                                       |                                             |                                 |
| `movies`   | `poster`     | ✓                                           |                                         | ✓                                           | ✓                               |
|            | `fanart`     | ✓                                           |                                         | ✓                                           |                                 |
|            | `banner`     |                                             |                                         | ✓                                           |                                 |
|            | `logo`       | ✓                                           |                                         | ✓                                           |                                 |
|            | `clearart`   |                                             |                                         | ✓                                           |                                 |
|            | `thumb`      |                                             |                                         | ✓                                           |                                 |
| `person`   | `headshot`   | ✓                                           |                                         |                                             |                                 |
|            | `character`  |                                             | ✓                                       |                                             |                                 |
