import { builder } from '../_internal/builder.ts';
import { commentsSortParamsSchema } from '../_internal/request/commentsSortParamsSchema.ts';
import { countryParamsSchema } from '../_internal/request/countryParamsSchema.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { extendedProfileQuerySchema } from '../_internal/request/extendedProfileQuerySchema.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { extendedWatchNowQuerySchema } from '../_internal/request/extendedWatchNowQuerySchema.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { ignoreQuerySchema } from '../_internal/request/ignoreQuerySchema.ts';
import { languageParamsSchema } from '../_internal/request/languageParamsSchema.ts';
import { limitlessQuerySchema } from '../_internal/request/limitlessQuerySchema.ts';
import { linksQuerySchema } from '../_internal/request/linksQuerySchema.ts';
import { mediaFilterParamsSchema } from '../_internal/request/mediaFilterParamsSchema.ts';
import { mediaReportRequestSchema } from '../_internal/request/mediaReportRequestSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { periodParamsSchema } from '../_internal/request/periodParamsSchema.ts';
import { recentPeriodParamsSchema } from '../_internal/request/recentPeriodParamsSchema.ts';
import { refreshQuerySchema } from '../_internal/request/refreshQuerySchema.ts';
import { statsQuerySchema } from '../_internal/request/statsQuerySchema.ts';
import { commentResponseSchema } from '../_internal/response/commentResponseSchema.ts';
import { episodeResponseSchema } from '../_internal/response/episodeResponseSchema.ts';
import { episodeStatsResponseSchema } from '../_internal/response/episodeStatsResponseSchema.ts';
import { episodeTranslationResponseSchema } from '../_internal/response/episodeTranslationResponseSchema.ts';
import { justWatchLinkResponseSchema } from '../_internal/response/justWatchLinkResponseSchema.ts';
import { listResponseSchema } from '../_internal/response/listResponseSchema.ts';
import { listSortSchema } from '../_internal/response/listSortSchema.ts';
import { listTypeSchema } from '../_internal/response/listTypeSchema.ts';
import { peopleResponseSchema } from '../_internal/response/peopleResponseSchema.ts';
import { profileResponseSchema } from '../_internal/response/profileResponseSchema.ts';
import { ratingsResponseSchema } from '../_internal/response/ratingsResponseSchema.ts';
import { sentimentsResponseSchema } from '../_internal/response/sentimentsResponseSchema.ts';
import type { showCertificationResponseSchema } from '../_internal/response/showCertificationResponseSchema.ts';
import { showResponseSchema } from '../_internal/response/showResponseSchema.ts';
import { showStatsResponseSchema } from '../_internal/response/showStatsResponseSchema.ts';
import { studioResponseSchema } from '../_internal/response/studioResponseSchema.ts';
import { translationResponseSchema } from '../_internal/response/translationResponseSchema.ts';
import { videoResponseSchema } from '../_internal/response/videoResponseSchema.ts';
import { watchNowResponseSchema } from '../_internal/response/watchNowResponseSchema.ts';
import { z } from '../_internal/z.ts';
import { episodeParamsSchema } from './schema/request/episodeParamsSchema.ts';
import { seasonParamsSchema } from './schema/request/seasonParamsSchema.ts';
import { showQueryParamsSchema } from './schema/request/showQueryParamsSchema.ts';
import { seasonResponseSchema } from './schema/response/seasonResponseSchema.ts';
import { showAnticipatedResponseSchema } from './schema/response/showAnticipatedResponseSchema.ts';
import { showHotResponseSchema } from './schema/response/showHotResponseSchema.ts';
import { showProgressResponseSchema } from './schema/response/showProgressResponseSchema.ts';
import { showStreamingResponseSchema } from './schema/response/showStreamingResponseSchema.ts';
import { showTrendingResponseSchema } from './schema/response/showTrendingResponseSchema.ts';
import { showWatchedResponseSchema } from './schema/response/showWatchedResponseSchema.ts';

const EPISODE_LEVEL = builder.router({
  summary: {
    summary: 'Get a single episode for a show',
    description: `#### ✨ Extended Info
Returns a single episode's details. All date and times are in UTC and were calculated using the episode's \`air_date\` and show's \`country\` and \`air_time\`.

> ### Note
> _If the \`first_aired\` is unknown, it will be set to \`null\`._

> ### Note
> _When getting \`full\` extended info, the \`episode_type\` field can have a value of \`standard\`, \`series_premiere\` (season 1, episode 1), \`season_premiere\` (episode 1), \`mid_season_finale\`, \`mid_season_premiere\` (the next episode after the mid season finale), \`season_finale\`, or \`series_finale\` (last episode to air for an ended show)._`,
    path: '',
    method: 'GET',
    query: extendedMediaQuerySchema,
    pathParams: idParamsSchema
      .merge(seasonParamsSchema)
      .merge(episodeParamsSchema),
    responses: {
      200: episodeResponseSchema,
    },
  },
  translations: {
    summary: 'Get all episode translations',
    description:
      'Returns all translations for an episode, including language, country, and translated values for title and overview. The `country` field can be used together with `language` to identify regional variants (for example `fr`/`fr` vs `fr`/`ca`).',
    path: '/translations/:language',
    method: 'GET',
    pathParams: idParamsSchema
      .merge(seasonParamsSchema)
      .merge(episodeParamsSchema)
      .merge(languageParamsSchema),
    responses: {
      200: episodeTranslationResponseSchema,
    },
  },
  stats: {
    summary: 'Get episode stats',
    description: 'Returns lots of episode stats.',
    path: '/stats',
    method: 'GET',
    pathParams: idParamsSchema
      .merge(seasonParamsSchema)
      .merge(episodeParamsSchema),
    responses: {
      200: episodeStatsResponseSchema,
    },
  },
  ratings: {
    summary: 'Get episode ratings',
    description:
      'Returns rating (between 0 and 10) and distribution for an episode.',
    path: '/ratings',
    method: 'GET',
    query: extendedQuerySchemaFactory<['all']>(),
    pathParams: idParamsSchema
      .merge(seasonParamsSchema)
      .merge(episodeParamsSchema),
    responses: {
      200: ratingsResponseSchema,
    },
  },
  watching: {
    summary: 'Get users watching right now',
    description: `#### ✨ Extended Info
Returns all users watching this episode right now.`,
    path: '/watching',
    method: 'GET',
    pathParams: idParamsSchema
      .merge(seasonParamsSchema)
      .merge(episodeParamsSchema),
    query: extendedQuerySchemaFactory<['full']>(),
    responses: {
      200: profileResponseSchema.array(),
    },
  },
  comments: {
    summary: 'Get all episode comments',
    description: `#### 🔓 OAuth Optional 📄 Pagination 😁 Emojis

Returns all top level comments for an episode. By default, comments are sorted by most \`likes\`. Other sorting options include \`likes_30\`, most \`replies\`, \`replies_30\`, most \`plays\`, highest \`rating\`, and \`added\` date.

> ### Note
> _If you send OAuth, comments from blocked users will be automatically filtered out._`,
    path: '/comments/:sort',
    method: 'GET',
    pathParams: idParamsSchema
      .merge(seasonParamsSchema)
      .merge(episodeParamsSchema)
      .merge(commentsSortParamsSchema),
    query: extendedProfileQuerySchema
      .merge(pageQuerySchema)
      .merge(limitlessQuerySchema),
    responses: {
      200: commentResponseSchema.array(),
    },
  },
  people: {
    summary: 'Get all people for an episode',
    description: `#### ✨ Extended Info
Returns all \`cast\` and \`crew\` for an episode. Each \`cast\` member will have a \`characters\` array and a standard \`person\` object.

The \`crew\` object will be broken up by department into \`production\`, \`art\`, \`crew\`, \`costume & make-up\`, \`directing\`, \`writing\`, \`sound\`, \`camera\`, \`visual effects\`, \`lighting\`, and \`editing\` (if there are people for those crew positions). Each of those members will have a \`jobs\` array and a standard \`person\` object.

#### Guest Stars
If you add \`?extended=guest_stars\` to the URL, it will return all guest stars that appeared in the episode.

> ### Note
> _This returns a lot of data, so please only use this extended parameter if you actually need it!_`,
    path: '/people',
    method: 'GET',
    query: extendedQuerySchemaFactory<['images']>(),
    pathParams: idParamsSchema
      .merge(seasonParamsSchema)
      .merge(episodeParamsSchema),
    responses: {
      200: peopleResponseSchema,
    },
  },
  watchnow: {
    summary: 'Get episode watch now sources',
    description: `#### ✨ Extended Info
Returns streaming and watch now sources for an episode in the requested country. Use \`links\` to include provider links when available.`,
    path: '/watchnow/:country',
    query: linksQuerySchema
      .merge(extendedWatchNowQuerySchema),
    method: 'GET',
    pathParams: idParamsSchema.merge(countryParamsSchema)
      .merge(seasonParamsSchema)
      .merge(episodeParamsSchema),
    responses: {
      200: watchNowResponseSchema,
    },
  },
  report: {
    summary: 'Report an episode',
    description: `#### 🔒 OAuth Required
Report an episode for moderator review. Send a \`reason\` and optional \`message\` with additional context. A user can only have one \`pending\` report per episode.

| reason | description |
|---|---|
| \`duplicate\` | Duplicate of another episode on Trakt |
| \`remove\` | Should be removed from Trakt |
| \`data_refresh\` | Request a full metadata refresh |
| \`metadata\` | Metadata is wrong (title, overview, etc) |
| \`adult\` | Marked as adult when it shouldn't be (or vice versa) |
| \`runtime\` | Runtime is incorrect |
| \`language\` | Not in English |
| \`spam\` | Spam or fake episode |
| \`tmdb\` | Should use TMDB as the datasource |
| \`other\` | Anything else (add details in \`message\`) |`,
    path: '/report',
    method: 'POST',
    pathParams: idParamsSchema
      .merge(seasonParamsSchema)
      .merge(episodeParamsSchema),
    body: mediaReportRequestSchema,
    responses: {
      201: z.undefined(),
      400: z.undefined(),
      409: z.undefined(),
    },
  },
}, {
  pathPrefix: '/seasons/:season/episodes/:episode',
});

const ENTITY_LEVEL = builder.router({
  summary: {
    summary: 'Get a single show',
    description: `#### ✨ Extended Info
Returns a single shows's details. If you request extended info, the \`airs\` object is relative to the show's country. You can use the \`day\`, \`time\`, and \`timezone\` to construct your own date then convert it to whatever timezone your user is in.

> ### Note
> _When getting \`full\` extended info, the \`status\` field can have a value of \`returning series\` (airing right now),  \`continuing\` (airing right now), \`in production\` (airing soon), \`planned\` (in development), \`upcoming\` (in development),  \`pilot\`, \`canceled\`, or \`ended\`._`,
    path: '',
    method: 'GET',
    query: extendedMediaQuerySchema,
    pathParams: idParamsSchema,
    responses: {
      200: showResponseSchema,
    },
  },
  ratings: {
    summary: 'Get show ratings',
    description:
      'Returns rating (between 0 and 10) and distribution for a show.',
    path: '/ratings',
    method: 'GET',
    query: extendedQuerySchemaFactory<['all']>(),
    pathParams: idParamsSchema,
    responses: {
      200: ratingsResponseSchema,
    },
  },
  stats: {
    summary: 'Get show stats',
    description: 'Returns lots of show stats.',
    path: '/stats',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: showStatsResponseSchema,
    },
  },
  progress: {
    watched: {
      summary: 'Get show watched progress',
      description: `#### 🔒 OAuth Required
Returns watched progress for a show including details on all aired seasons and episodes. The \`next_episode\` will be the next episode the user should watch, if there are no upcoming episodes it will be set to \`null\`. If not \`null\`, the \`reset_at\` date is when the user started re-watching the show. Your app can adjust the progress by ignoring episodes with a \`last_watched_at\` prior to the \`reset_at\`.

By default, any hidden seasons will be removed from the response and stats. To include these and adjust the completion stats, set the \`hidden\` flag to \`true\`.

By default, specials will be excluded from the response. Set the \`specials\` flag to \`true\` to include season 0 and adjust the stats accordingly. If you'd like to include specials, but not adjust the stats, set \`count_specials\` to \`false\`.

By default, the \`last_episode\` and \`next_episode\` are calculated using the last \`aired\` episode the user has watched, even if they've watched older episodes more recently. To use their last watched episode for these calculations, set the \`last_activity\` flag to \`watched\`.

> ### Note
> _Only aired episodes are used to calculate progress. Episodes in the future or without an air date are ignored._`,
      path: '/progress/watched',
      method: 'GET',
      pathParams: idParamsSchema,
      query: extendedMediaQuerySchema
        .merge(showQueryParamsSchema)
        .merge(statsQuerySchema),
      responses: {
        200: showProgressResponseSchema,
      },
    },
  },
  translations: {
    summary: 'Get all show translations',
    description:
      'Returns all translations for a show, including language, country, and translated values for title, tagline and overview. The `country` field can be used together with `language` to identify regional variants (for example `fr`/`fr` vs `fr`/`ca`).',
    path: '/translations/:language',
    method: 'GET',
    pathParams: idParamsSchema.merge(languageParamsSchema),
    responses: {
      200: translationResponseSchema,
    },
  },
  related: {
    summary: 'Get related shows',
    description: `#### 📄 Pagination ✨ Extended Info

Returns related and similar shows.`,
    path: '/related',
    method: 'GET',
    pathParams: idParamsSchema,
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema),
    responses: {
      200: showResponseSchema.array(),
    },
  },
  watching: {
    summary: 'Get users watching right now',
    description: `#### ✨ Extended Info
Returns all users watching this show right now.`,
    path: '/watching',
    method: 'GET',
    pathParams: idParamsSchema,
    query: extendedQuerySchemaFactory<['full']>(),
    responses: {
      200: profileResponseSchema.array(),
    },
  },
  studios: {
    summary: 'Get show studios',
    description: 'Returns all studios for a show.',
    path: '/studios',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: studioResponseSchema.array(),
    },
  },
  watchnow: {
    summary: 'Get show watch now sources',
    description: `#### ✨ Extended Info
Returns streaming and watch now sources for a show in the requested country. Use \`links\` to include provider links when available.`,
    path: '/watchnow/:country',
    query: linksQuerySchema
      .merge(extendedWatchNowQuerySchema),
    method: 'GET',
    pathParams: idParamsSchema.merge(countryParamsSchema),
    responses: {
      200: watchNowResponseSchema,
    },
  },
  justwatch: builder.router({
    link: {
      summary: 'Get show JustWatch links',
      description:
        'Returns JustWatch links for a show in the requested country. Use the show `id` and two-character `country` path parameter to identify the lookup.',
      path: '/watchnow/justwatch_links/:country',
      method: 'GET',
      pathParams: idParamsSchema,
      responses: {
        200: justWatchLinkResponseSchema,
      },
    },
    refresh: {
      summary: 'Refresh show JustWatch links',
      description: `#### 🔥 VIP Only 🔒 OAuth Required
Queue a refresh of a show's JustWatch watch now links.`,
      path: '/refresh/justwatch',
      method: 'POST',
      pathParams: idParamsSchema,
      body: z.undefined(),
      responses: {
        201: z.undefined(),
      },
    },
  }),
  people: {
    summary: 'Get all people for a show',
    description: `#### ✨ Extended Info
Returns all \`cast\` and \`crew\` for a show, including the \`episode_count\` for which they appears. Each \`cast\` member will have a \`characters\` array and a standard \`person\` object.

The \`crew\` object will be broken up by department into \`production\`, \`art\`, \`crew\`, \`costume & make-up\`, \`directing\`, \`writing\`, \`sound\`, \`camera\`, \`visual effects\`, \`lighting\`, \`editing\`, and \`created  by\` (if there are people for those crew positions). Each of those members will have a \`jobs\` array and a standard \`person\` object.

#### Guest Stars
If you add \`?extended=guest_stars\` to the URL, it will return all guest stars that appeared in at least 1 episode of the show.

> ### Note
> _This returns a lot of data, so please only use this extended parameter if you actually need it!_`,
    path: '/people',
    method: 'GET',
    query: extendedQuerySchemaFactory<['images']>(),
    pathParams: idParamsSchema,
    responses: {
      200: peopleResponseSchema,
    },
  },
  seasons: {
    summary: 'Get all seasons for a show',
    description: `#### ✨ Extended Info
Returns all seasons for a show including the number of episodes in each season.

#### Episodes
If you add \`?extended=episodes\` to the URL, it will return all episodes for all seasons.

> ### Note
> _This returns a lot of data, so please only use this extended parameter if you actually need it!_`,
    path: '/seasons',
    method: 'GET',
    query: extendedMediaQuerySchema,
    pathParams: idParamsSchema,
    responses: {
      200: seasonResponseSchema.array(),
    },
  },
  season: builder.router({
    episodes: {
      summary: 'Get all episodes for a single season',
      description: `#### ✨ Extended Info
Returns all episodes for a specific season of a show.

#### Translations
If you'd like to included translated episode titles and overviews in the response, include the \`translations\` parameter in the URL. Include all languages by setting the parameter to \`all\` or use a specific 2 digit country language code to further limit it. Each translation includes both \`language\` and \`country\` so regional variants (for example \`fr\`/\`fr\` vs \`fr\`/\`ca\`) can be distinguished.

> ### Note
> _This returns a lot of data, so please only use this extended parameter if you actually need it!_`,
      path: '',
      method: 'GET',
      query: extendedMediaQuerySchema,
      pathParams: idParamsSchema
        .merge(seasonParamsSchema),
      responses: {
        200: episodeResponseSchema.array(),
      },
    },
    videos: {
      summary: 'Get all videos',
      description: `#### ✨ Extended Info
Returns all videos including trailers, teasers, clips, and featurettes.`,
      path: '/videos',
      method: 'GET',
      pathParams: idParamsSchema
        .merge(seasonParamsSchema),
      responses: {
        200: videoResponseSchema.array(),
      },
    },
    justwatch: builder.router({
      link: {
        summary: 'Get season JustWatch links',
        description:
          'Returns JustWatch links for a show season in the requested country. Use `id`, `season`, and the two-character `country` path parameter to identify the lookup.',
        path: '/watchnow/justwatch_links/:country',
        method: 'GET',
        pathParams: idParamsSchema,
        responses: {
          200: justWatchLinkResponseSchema,
        },
      },
    }),
    report: {
      summary: 'Report a season',
      description: `#### 🔒 OAuth Required
Report a season for moderator review. Send a \`reason\` and optional \`message\` with additional context. A user can only have one \`pending\` report per season.

| reason | description |
|---|---|
| \`duplicate\` | Duplicate of another season on Trakt |
| \`remove\` | Should be removed from Trakt |
| \`data_refresh\` | Request a full metadata refresh |
| \`metadata\` | Metadata is wrong (title, overview, etc) |
| \`adult\` | Marked as adult when it shouldn't be (or vice versa) |
| \`runtime\` | Runtime is incorrect |
| \`language\` | Not in English |
| \`spam\` | Spam or fake season |
| \`tmdb\` | Should use TMDB as the datasource |
| \`other\` | Anything else (add details in \`message\`) |`,
      path: '/report',
      method: 'POST',
      pathParams: idParamsSchema.merge(seasonParamsSchema),
      body: mediaReportRequestSchema,
      responses: {
        201: z.undefined(),
        400: z.undefined(),
        409: z.undefined(),
      },
    },
  }, {
    pathPrefix: '/seasons/:season',
  }),
  videos: {
    summary: 'Get all videos',
    description: `#### ✨ Extended Info
Returns all videos including trailers, teasers, clips, and featurettes.`,
    path: '/videos',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: videoResponseSchema.array(),
    },
  },
  lists: {
    summary: 'Get lists containing this show',
    description: `#### 📄 Pagination 😁 Emojis

Returns all lists that contain this show. By default, \`personal\` lists are returned sorted by the most \`popular\`.`,
    path: '/lists/:type/:sort',
    method: 'GET',
    query: extendedQuerySchemaFactory<['images']>()
      .merge(pageQuerySchema),
    pathParams: idParamsSchema
      .merge(listSortSchema)
      .merge(listTypeSchema),
    responses: {
      200: listResponseSchema.array(),
    },
  },
  comments: {
    summary: 'Get all show comments',
    description: `#### 🔓 OAuth Optional 📄 Pagination 😁 Emojis

Returns all top level comments for a show. By default, comments are sorted by most \`likes\`. Other sorting options include \`likes_30\`, most \`replies\`, \`replies_30\`, highest \`watched\` percentage, most \`plays\`, highest \`rating\`, and \`added\` date.

> ### Note
> _If you send OAuth, comments from blocked users will be automatically filtered out._`,
    path: '/comments/:sort',
    method: 'GET',
    pathParams: idParamsSchema
      .merge(commentsSortParamsSchema),
    query: extendedProfileQuerySchema
      .merge(pageQuerySchema)
      .merge(limitlessQuerySchema),
    responses: {
      200: commentResponseSchema.array(),
    },
  },
  sentiments: {
    summary: 'Get show sentiments',
    description:
      'Returns sentiment counts for comments and reactions attached to a show.',
    path: '/sentiments',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: sentimentsResponseSchema,
    },
  },
  report: {
    summary: 'Report a show',
    description: `#### 🔒 OAuth Required
Report a show for moderator review. Send a \`reason\` and optional \`message\` with additional context. A user can only have one \`pending\` report per show.

| reason | description |
|---|---|
| \`duplicate\` | Duplicate of another show on Trakt |
| \`remove\` | Should be removed from Trakt |
| \`data_refresh\` | Request a full metadata refresh |
| \`metadata\` | Metadata is wrong (title, overview, etc) |
| \`adult\` | Marked as adult when it shouldn't be (or vice versa) |
| \`runtime\` | Runtime is incorrect |
| \`language\` | Not in English |
| \`spam\` | Spam or fake title |
| \`tmdb\` | Should use TMDB as the datasource |
| \`other\` | Anything else (add details in \`message\`) |`,
    path: '/report',
    method: 'POST',
    pathParams: idParamsSchema,
    body: mediaReportRequestSchema,
    responses: {
      201: z.undefined(),
      400: z.undefined(),
      409: z.undefined(),
    },
  },
  refresh: {
    summary: 'Refresh show metadata',
    description: `#### 🔥 VIP Only 🔒 OAuth Required
Queue a full metadata refresh for a show. Pass \`images=true\` to also refresh the show's images.`,
    path: '/refresh',
    method: 'POST',
    query: refreshQuerySchema,
    pathParams: idParamsSchema,
    body: z.undefined(),
    responses: {
      201: z.undefined(),
    },
  },
  episode: EPISODE_LEVEL,
}, {
  pathPrefix: '/:id',
});

const GLOBAL_LEVEL = builder.router({
  trending: {
    summary: 'Get trending shows',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters

Returns the most watched shows over the last 24 hours. Shows with the most \`watchers\` are returned first.`,
    path: '/trending',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: showTrendingResponseSchema.array(),
    },
  },
  watched: {
    summary: 'Get the most watched shows',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters

Returns the most watched (unique users) shows in the specified time \`period\`, defaulting to \`weekly\`. All stats are relative to the specific time \`period\`.`,
    path: '/watched/:period',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    pathParams: periodParamsSchema,
    responses: {
      200: showWatchedResponseSchema.array(),
    },
  },
  anticipated: {
    summary: 'Get the most anticipated shows',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters

Returns the most anticipated shows based on the number of lists a show appears on.`,
    path: '/anticipated',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: showAnticipatedResponseSchema.array(),
    },
  },
  hot: {
    summary: 'Get hot shows',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns shows that are currently hot on Trakt. Results can be filtered by media fields or ignored user state.`,
    path: '/hot',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: showHotResponseSchema.array(),
    },
  },
  popular: {
    summary: 'Get popular shows',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters

Returns the most popular shows. Popularity is calculated using the rating percentage and the number of ratings.`,
    path: '/popular',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: showResponseSchema.array(),
    },
  },
  streaming: {
    summary: 'Get streaming shows',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns shows recently available on streaming services for the requested \`period\`. Results can be filtered by media fields or ignored user state.`,
    path: '/streaming/:period',
    method: 'GET',
    pathParams: recentPeriodParamsSchema,
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: showStreamingResponseSchema.array(),
    },
  },
});

export const shows = builder.router({
  ...ENTITY_LEVEL,
  ...GLOBAL_LEVEL,
}, {
  pathPrefix: '/shows',
});

export type ShowIdParams = z.infer<typeof idParamsSchema>;

export { showResponseSchema };
export type ShowResponse = z.infer<typeof showResponseSchema>;

export { showProgressResponseSchema };
export type ShowProgressResponse = z.infer<typeof showProgressResponseSchema>;

export { showQueryParamsSchema };
export type ShowQueryParams = z.infer<typeof showQueryParamsSchema>;

export { showTrendingResponseSchema };
export type ShowTrendingResponse = z.infer<typeof showTrendingResponseSchema>;

export { showWatchedResponseSchema };
export type ShowWatchedResponse = z.infer<typeof showWatchedResponseSchema>;

export type ShowStatsResponse = z.infer<typeof showStatsResponseSchema>;

export { showAnticipatedResponseSchema };
export type ShowAnticipatedResponse = z.infer<
  typeof showAnticipatedResponseSchema
>;

export { showHotResponseSchema };
export type ShowHotResponse = z.infer<
  typeof showHotResponseSchema
>;

export type ShowCertificationResponse = z.infer<
  typeof showCertificationResponseSchema
>;

export { seasonResponseSchema };
export type SeasonsResponse = z.infer<typeof seasonResponseSchema>[];

export { showStreamingResponseSchema };
export type ShowStreamingResponse = z.infer<typeof showStreamingResponseSchema>;

export { episodeParamsSchema };

export { seasonParamsSchema };

export { mediaReportRequestSchema };
export type MediaReportRequest = z.infer<typeof mediaReportRequestSchema>;
