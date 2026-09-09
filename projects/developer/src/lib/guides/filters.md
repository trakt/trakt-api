---
updatedAt: 2026-05-19T09:13:46.000Z
---

# Filters

Some `movies`, `shows`, `calendars`,  and `search` methods support additional filters and will be tagged with 🎚 **Filters**. Applying these filters refines the results and helps your users to more easily discover new items.

Add a query string (i.e. `?years=2016&genres=action`) with any filters you want to use. Some filters allow multiples which can be sent as comma delimited parameters. For example, `?genres=action,adventure` would match the `action` OR `adventure` genre.

> ### 🅽🅾🆃🅴
>
> *Make sure to properly URL encode the parameters including spaces and special characters.*

#### Common Filters

| Parameter    | Multiples | Example  | Value                                              |
| ------------ | --------- | -------- | -------------------------------------------------- |
| `query`      |           | `batman` | Search titles and descriptions.                    |
| `years`      |           | `2016`   | 4 digit year or range of years.                    |
| `genres`     | ✓         | `action` | [Genre slugs.](/?section=reference&operation=getGenresList)                  |
| `languages`  | ✓         | `en`     | [2 character language code.](/?section=reference&operation=getLanguagesList) |
| `countries`  | ✓         | `us`     | [2 character country code.](/?section=reference&operation=getCountriesList)  |
| `runtimes`   |           | `30-90`  | Range in minutes.                                  |
| `studio_ids` | ✓         | `42`     | Trakt studio ID.                                   |

#### Rating Filters

Trakt, TMDB, and IMDB ratings apply to `movies`, `shows`, and `episodes`. Rotten Tomatoes and Metacritic apply to `movies`.

| Parameter        | Multiples | Example      | Value                                                       |
| ---------------- | --------- | ------------ | ----------------------------------------------------------- |
| `ratings`        |           | `75-100`     | Trakt rating range between `0` and `100`.                   |
| `votes`          |           | `5000-10000` | Trakt vote count between `0` and `100000`.                  |
| `tmdb_ratings`   |           | `5.5-10.0`   | TMDB rating range between `0.0` and `10.0`.                 |
| `tmdb_votes`     |           | `5000-10000` | TMDB vote count between `0` and `100000`.                   |
| `imdb_ratings`   |           | `5.5-10.0`   | IMDB rating range between `0.0` and `10.0`.                 |
| `imdb_votes`     |           | `5000-10000` | IMDB vote count between `0` and `3000000`.                  |
| `rt_meters`      |           | `55-1000`    | Rotten Tomatoes tomatometer range between `0` and `100`.    |
| `rt_user_meters` |           | `65-100`     | Rotten Tomatoes audience score range between `0` and `100`. |
| `metascores`     |           | `5.5-10.0`   | Metacritic score range between `0` and `100`.               |

#### Movie Filters

| Parameter        | Multiples | Example | Value                     |
| ---------------- | --------- | ------- | ------------------------- |
| `certifications` | ✓         | `pg-13` | US content certification. |

#### Show Filters

| Parameter        | Multiples | Example | Value                                                                                                              |
| ---------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| `certifications` | ✓         | `tv-pg` | US content certification.                                                                                          |
| `network_ids`    | ✓         | `53`    | Trakt network ID.                                                                                                  |
| `status`         | ✓         | `ended` | Set to `returning series`, `continuing`, `in production`, `planned`, `upcoming`,  `pilot`, `canceled`, or `ended`. |

#### Episode Filters

| Parameter        | Multiples | Example               | Value                                                                                                                                      |
| ---------------- | --------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `certifications` | ✓         | `tv-pg`               | US content certification.                                                                                                                  |
| `network_ids`    | ✓         | `53`                  | Trakt network ID.                                                                                                                          |
| `episode_types`  | ✓         | `mid_season_premiere` | Set to `standard`, `series_premiere`, `season_premiere`, `mid_season_finale`, `mid_season_premiere`, `season_finale`,  or `series_finale`. |
