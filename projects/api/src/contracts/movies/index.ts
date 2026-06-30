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
import { commentResponseSchema } from '../_internal/response/commentResponseSchema.ts';
import type { genreEnumSchema } from '../_internal/response/genreEnumSchema.ts';
import { justWatchLinkResponseSchema } from '../_internal/response/justWatchLinkResponseSchema.ts';
import { listResponseSchema } from '../_internal/response/listResponseSchema.ts';
import { listSortSchema } from '../_internal/response/listSortSchema.ts';
import { listTypeSchema } from '../_internal/response/listTypeSchema.ts';
import type { movieCertificationResponseSchema } from '../_internal/response/movieCertificationResponseSchema.ts';
import { movieResponseSchema } from '../_internal/response/movieResponseSchema.ts';
import { movieStatsResponseSchema } from '../_internal/response/movieStatsResponseSchema.ts';
import {
  peopleResponseSchema,
} from '../_internal/response/peopleResponseSchema.ts';
import { profileResponseSchema } from '../_internal/response/profileResponseSchema.ts';
import { ratingsResponseSchema } from '../_internal/response/ratingsResponseSchema.ts';
import { sentimentsResponseSchema } from '../_internal/response/sentimentsResponseSchema.ts';
import { studioResponseSchema } from '../_internal/response/studioResponseSchema.ts';
import { translationResponseSchema } from '../_internal/response/translationResponseSchema.ts';
import { videoResponseSchema } from '../_internal/response/videoResponseSchema.ts';
import type { watchNowRankResponseSchema } from '../_internal/response/watchNowRankResponseSchema.ts';
import {
  watchNowResponseSchema,
  type watchNowServiceResponseSchema,
} from '../_internal/response/watchNowResponseSchema.ts';
import { z } from '../_internal/z.ts';
import { movieAnticipatedResponseSchema } from './schema/response/movieAnticipatedResponseSchema.ts';
import { movieFavoritedResponseSchema } from './schema/response/movieFavoritedResponseSchema.ts';
import { movieHotResponseSchema } from './schema/response/movieHotResponseSchema.ts';
import { movieStreamingResponseSchema } from './schema/response/movieStreamingResponseSchema.ts';
import { movieTrendingResponseSchema } from './schema/response/movieTrendingResponseSchema.ts';
import { movieWatchedResponseSchema } from './schema/response/movieWatchedResponseSchema.ts';

const startDateParamsSchema = z.object({
  start_date: z.string().describe('UTC date to start checking for updates.'),
});

const movieAliasResponseSchema = z.object({
  title: z.string(),
  country: z.string().nullable().optional(),
});

const movieReleaseResponseSchema = z.object({
  country: z.string(),
  certification: z.string().nullable().optional(),
  release_date: z.string(),
  release_type: z.string().optional(),
  note: z.string().nullable().optional(),
}).passthrough();

const movieBoxOfficeResponseSchema = z.object({
  revenue: z.number().int().optional(),
  movie: movieResponseSchema,
});

const movieUpdatedResponseSchema = z.object({
  updated_at: z.string().datetime(),
  movie: movieResponseSchema,
});

const ENTITY_LEVEL = builder.router({
  summary: {
    summary: 'Get a movie',
    description: `#### ✨ Extended Info
Returns a single movie's details.

> ### Note
> _When getting \`full\` extended info, the \`status\` field can have a value of \`released\`, \`in production\`, \`post production\`, \`planned\`, \`rumored\`, or \`canceled\`._`,
    path: '',
    method: 'GET',
    query: extendedMediaQuerySchema,
    pathParams: idParamsSchema,
    responses: {
      200: movieResponseSchema,
    },
  },
  ratings: {
    summary: 'Get movie ratings',
    description:
      'Returns rating (between 0 and 10) and distribution for a movie.',
    path: '/ratings',
    method: 'GET',
    query: extendedQuerySchemaFactory<['all']>(),
    pathParams: idParamsSchema,
    responses: {
      200: ratingsResponseSchema,
    },
  },
  stats: {
    summary: 'Get movie stats',
    description: 'Returns lots of movie stats.',
    path: '/stats',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: movieStatsResponseSchema,
    },
  },
  aliases: {
    summary: 'Get all movie aliases',
    description:
      'Returns all title aliases for a movie. Includes localized and alternate titles when available.',
    path: '/aliases',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: movieAliasResponseSchema.array(),
    },
  },
  releases: {
    summary: 'Get all movie releases',
    description:
      'Returns release dates for a movie in the requested country, including certification and release type when available.',
    path: '/releases/:country',
    method: 'GET',
    pathParams: idParamsSchema.merge(countryParamsSchema),
    responses: {
      200: movieReleaseResponseSchema.array(),
    },
  },
  translations: {
    summary: 'Get all movie translations',
    description:
      'Returns all translations for a movie, including language, country, and translated values for title, tagline and overview. The `country` field can be used together with `language` to identify regional variants (for example `fr`/`fr` vs `fr`/`ca`).',
    path: '/translations/:language',
    method: 'GET',
    pathParams: idParamsSchema.merge(languageParamsSchema),
    responses: {
      200: translationResponseSchema,
    },
  },
  related: {
    summary: 'Get related movies',
    description: `#### 📄 Pagination ✨ Extended Info

Returns related and similar movies.`,
    path: '/related',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema),
    pathParams: idParamsSchema,
    responses: {
      200: movieResponseSchema.array(),
    },
  },
  watching: {
    summary: 'Get users watching right now',
    description: `#### ✨ Extended Info
Returns all users watching this movie right now.`,
    path: '/watching',
    method: 'GET',
    pathParams: idParamsSchema,
    query: extendedQuerySchemaFactory<['full']>(),
    responses: {
      200: profileResponseSchema.array(),
    },
  },
  studios: {
    summary: 'Get movie studios',
    description: 'Returns all studios for a movie.',
    path: '/studios',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: studioResponseSchema.array(),
    },
  },
  watchnow: {
    summary: 'Get movie watch now sources',
    description: `#### 🫣 Limited Access ✨ Extended Info
This endpoint is documented for visibility, but access is currently limited and may not be available to all API consumers.

Returns streaming and watch now sources for a movie in the requested country. Use \`links\` to include provider links when available.`,
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
      summary: 'Get movie JustWatch links',
      description:
        '#### 🫣 Limited Access\nThis endpoint is documented for visibility, but access is currently limited and may not be available to all API consumers.\n\nReturns JustWatch links for a movie in the requested country. Use the movie `id` and two-character `country` path parameter to identify the lookup.',
      path: '/watchnow/justwatch_links/:country',
      method: 'GET',
      pathParams: idParamsSchema,
      responses: {
        200: justWatchLinkResponseSchema,
      },
    },
    refresh: {
      summary: 'Refresh movie JustWatch links',
      description: `#### 🔥 VIP Only 🔒 OAuth Required
Queue a refresh of a movie's JustWatch watch now links.`,
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
    summary: 'Get all people for a movie',
    description: `#### ✨ Extended Info
Returns all \`cast\` and \`crew\` for a movie. Each \`cast\` member will have a \`characters\` array and a standard \`person\` object.

The \`crew\` object will be broken up by department into \`production\`, \`art\`, \`crew\`, \`costume & make-up\`, \`directing\`, \`writing\`, \`sound\`, \`camera\`, \`visual effects\`, \`lighting\`, and \`editing\` (if there are people for those crew positions). Each of those members will have a \`jobs\` array and a standard \`person\` object.`,
    path: '/people',
    method: 'GET',
    query: extendedQuerySchemaFactory<['images']>(),
    pathParams: idParamsSchema,
    responses: {
      200: peopleResponseSchema,
    },
  },
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
    summary: 'Get lists containing this movie',
    description: `#### 📄 Pagination 😁 Emojis

Returns all lists that contain this movie. By default, \`personal\` lists are returned sorted by the most \`popular\`.`,
    path: '/lists/:type/:sort',
    method: 'GET',
    query: extendedProfileQuerySchema
      .merge(pageQuerySchema),
    pathParams: idParamsSchema
      .merge(listSortSchema)
      .merge(listTypeSchema),
    responses: {
      200: listResponseSchema.array(),
    },
  },
  comments: {
    summary: 'Get all movie comments',
    description: `#### 🔓 OAuth Optional 📄 Pagination 😁 Emojis

Returns all top level comments for a movie. By default, comments are sorted by most \`likes\`. Other sorting options include \`likes_30\`, most \`replies\`, \`replies_30\`, most \`plays\`, highest \`rating\`, and \`added\` date.

> ### Note
> _If you send OAuth, comments from blocked users will be automatically filtered out._`,
    path: '/comments/:sort',
    method: 'GET',
    query: extendedProfileQuerySchema
      .merge(pageQuerySchema)
      .merge(limitlessQuerySchema),
    pathParams: idParamsSchema.merge(commentsSortParamsSchema),
    responses: {
      200: commentResponseSchema.array(),
    },
  },
  sentiments: {
    summary: 'Get movie sentiments',
    description:
      'Returns sentiment counts for comments and reactions attached to a movie.',
    path: '/sentiments',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: sentimentsResponseSchema,
    },
  },
  report: {
    summary: 'Report a movie',
    description: `#### 🔒 OAuth Required
Report a movie for moderator review. Send a \`reason\` and optional \`message\` with additional context. A user can only have one \`pending\` report per movie.

| reason | description |
|---|---|
| \`duplicate\` | Duplicate of another movie on Trakt |
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
    summary: 'Refresh movie metadata',
    description: `#### 🔥 VIP Only 🔒 OAuth Required
Queue a full metadata refresh for a movie. Pass \`images=true\` to also refresh the movie's images.`,
    path: '/refresh',
    method: 'POST',
    query: refreshQuerySchema,
    pathParams: idParamsSchema,
    body: z.undefined(),
    responses: {
      201: z.undefined(),
    },
  },
}, {
  pathPrefix: '/:id',
});

const GLOBAL_LEVEL = builder.router({
  trending: {
    summary: 'Get trending movies',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters

Returns the most watched movies over the last 24 hours. Movies with the most \`watchers\` are returned first.`,
    path: '/trending',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: movieTrendingResponseSchema.array(),
    },
  },
  watched: {
    summary: 'Get the most watched movies',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters

Returns the most watched (unique users) movies in the specified time \`period\`, defaulting to \`weekly\`. All stats are relative to the specific time \`period\`.`,
    path: '/watched/:period',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    pathParams: periodParamsSchema,
    responses: {
      200: movieWatchedResponseSchema.array(),
    },
  },
  favorited: {
    summary: 'Get the most favorited movies',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters

Returns the most favorited movies in the specified time \`period\`, defaulting to \`weekly\`.`,
    path: '/favorited/:period',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    pathParams: periodParamsSchema,
    responses: {
      200: movieFavoritedResponseSchema.array(),
    },
  },
  played: {
    summary: 'Get the most played movies',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters

Returns the most played movies in the specified time \`period\`, defaulting to \`weekly\`.`,
    path: '/played/:period',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    pathParams: periodParamsSchema,
    responses: {
      200: movieWatchedResponseSchema.array(),
    },
  },
  collected: {
    summary: 'Get the most collected movies',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters

Returns the most collected movies in the specified time \`period\`, defaulting to \`weekly\`.`,
    path: '/collected/:period',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    pathParams: periodParamsSchema,
    responses: {
      200: movieWatchedResponseSchema.array(),
    },
  },
  boxoffice: {
    summary: 'Get the weekend box office',
    description:
      'Returns the top 10 grossing movies in the U.S. box office last weekend. Updated every Monday morning.',
    path: '/boxoffice',
    method: 'GET',
    query: extendedMediaQuerySchema,
    responses: {
      200: movieBoxOfficeResponseSchema.array(),
    },
  },
  updates: {
    summary: 'Get recently updated movies',
    description:
      'Returns all movies updated since the specified UTC date. We recommend storing the latest `updated_at` locally and using it for the next request.',
    path: '/updates/:start_date',
    method: 'GET',
    pathParams: startDateParamsSchema,
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema),
    responses: {
      200: movieUpdatedResponseSchema.array(),
    },
  },
  updatedIds: {
    summary: 'Get recently updated movie Trakt IDs',
    description:
      'Returns Trakt IDs for movies updated since the specified UTC date.',
    path: '/updates/id/:start_date',
    method: 'GET',
    pathParams: startDateParamsSchema,
    query: pageQuerySchema,
    responses: {
      200: z.number().int().array(),
    },
  },
  anticipated: {
    summary: 'Get the most anticipated movies',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters

Returns the most anticipated movies based on the number of lists a movie appears on.`,
    path: '/anticipated',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: movieAnticipatedResponseSchema.array(),
    },
  },
  hot: {
    summary: 'Get hot movies',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns movies that are currently hot on Trakt. Results can be filtered by media fields or ignored user state.`,
    path: '/hot',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: movieHotResponseSchema.array(),
    },
  },
  popular: {
    summary: 'Get popular movies',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters

Returns the most popular movies. Popularity is calculated using the rating percentage and the number of ratings.`,
    path: '/popular',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: movieResponseSchema.array(),
    },
  },
  streaming: {
    summary: 'Get streaming movies',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns movies recently available on streaming services for the requested \`period\`. Results can be filtered by media fields or ignored user state.`,
    path: '/streaming/:period',
    method: 'GET',
    pathParams: recentPeriodParamsSchema,
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: movieStreamingResponseSchema.array(),
    },
  },
});

export const movies = builder.router({
  ...ENTITY_LEVEL,
  ...GLOBAL_LEVEL,
}, {
  pathPrefix: '/movies',
});

export type MovieIdParams = z.infer<typeof idParamsSchema>;

export { movieResponseSchema };
export type MovieResponse = z.infer<typeof movieResponseSchema>;

export type Genre = z.infer<typeof genreEnumSchema>;

export type WatchNowServiceResponse = z.infer<
  typeof watchNowServiceResponseSchema
>;
export type watchNowRankResponse = z.infer<
  typeof watchNowRankResponseSchema
>;

export type MovieStatsResponse = z.infer<typeof movieStatsResponseSchema>;

export { movieTrendingResponseSchema };
export type MovieTrendingResponse = z.infer<
  typeof movieTrendingResponseSchema
>;

export { movieWatchedResponseSchema };
export type MovieWatchedResponse = z.infer<
  typeof movieWatchedResponseSchema
>;

export { movieFavoritedResponseSchema };
export type MovieFavoritedResponse = z.infer<
  typeof movieFavoritedResponseSchema
>;

export { movieAnticipatedResponseSchema };
export type MovieAnticipatedResponse = z.infer<
  typeof movieAnticipatedResponseSchema
>;

export { movieHotResponseSchema };
export type MovieHotResponse = z.infer<
  typeof movieHotResponseSchema
>;

export type MovieCertificationResponse = z.infer<
  typeof movieCertificationResponseSchema
>;

export { movieStreamingResponseSchema };
export type MovieStreamingResponse = z.infer<
  typeof movieStreamingResponseSchema
>;
