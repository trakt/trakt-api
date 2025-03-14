import { builder } from '../_internal/builder.ts';
import { commentsSortParamsSchema } from '../_internal/request/commentsSortParamsSchema.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { ignoreQuerySchema } from '../_internal/request/ignoreQuerySchema.ts';
import { languageParamsSchema } from '../_internal/request/languageParamsSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { periodParamsSchema } from '../_internal/request/periodParamsSchema.ts';
import { statsQuerySchema } from '../_internal/request/statsQuerySchema.ts';
import { commentResponseSchema } from '../_internal/response/commentResponseSchema.ts';
import { episodeResponseSchema } from '../_internal/response/episodeResponseSchema.ts';
import { episodeStatsResponseSchema } from '../_internal/response/episodeStatsResponseSchema.ts';
import { episodeTranslationResponseSchema } from '../_internal/response/episodeTranslationResponseSchema.ts';
import { listResponseSchema } from '../_internal/response/listResponseSchema.ts';
import { listSortSchema } from '../_internal/response/listSortSchema.ts';
import { listTypeSchema } from '../_internal/response/listTypeSchema.ts';
import { peopleResponseSchema } from '../_internal/response/peopleResponseSchema.ts';
import { ratingsResponseSchema } from '../_internal/response/ratingsResponseSchema.ts';
import { showAnticipatedResponseSchema } from '../_internal/response/showAnticipatedResponseSchema.ts';
import type { showCertificationResponseSchema } from '../_internal/response/showCertificationResponseSchema.ts';
import { showResponseSchema } from '../_internal/response/showResponseSchema.ts';
import { showStatsResponseSchema } from '../_internal/response/showStatsResponseSchema.ts';
import { showTrendingResponseSchema } from '../_internal/response/showTrendingResponseSchema.ts';
import { studioResponseSchema } from '../_internal/response/studioResponseSchema.ts';
import { translationResponseSchema } from '../_internal/response/translationResponseSchema.ts';
import { profileResponseSchema } from '../_internal/response/userProfileResponseSchema.ts';
import { watchNowResponseSchema } from '../_internal/response/watchNowResponseSchema.ts';
import type { z } from '../_internal/z.ts';
import { episodeParamsSchema } from './_internal/request/episodeParamsSchema.ts';
import { seasonParamsSchema } from './_internal/request/seasonParamsSchema.ts';
import { showQueryParamsSchema } from './_internal/request/showQueryParamsSchema.ts';
import { seasonResponseSchema } from './_internal/response/seasonResponseSchema.ts';
import { showProgressResponseSchema } from './_internal/response/showProgressResponseSchema.ts';
import { showWatchedResponseSchema } from './_internal/response/showWatchedResponseSchema.ts';

const EPISODE_LEVEL = builder.router({
  summary: {
    path: '',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    pathParams: idParamsSchema
      .merge(seasonParamsSchema)
      .merge(episodeParamsSchema),
    responses: {
      200: episodeResponseSchema,
    },
  },
  translations: {
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
    path: '/comments/:sort',
    method: 'GET',
    pathParams: idParamsSchema
      .merge(seasonParamsSchema)
      .merge(episodeParamsSchema)
      .merge(commentsSortParamsSchema),
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: commentResponseSchema.array(),
    },
  },
  people: {
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
    path: '/watchnow/:country',
    method: 'GET',
    pathParams: idParamsSchema
      .merge(seasonParamsSchema)
      .merge(episodeParamsSchema),
    responses: {
      200: watchNowResponseSchema,
    },
  },
}, {
  pathPrefix: '/seasons/:season/episodes/:episode',
});

const ENTITY_LEVEL = builder.router({
  summary: {
    path: '',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    pathParams: idParamsSchema,
    responses: {
      200: showResponseSchema,
    },
  },
  ratings: {
    path: '/ratings',
    method: 'GET',
    query: extendedQuerySchemaFactory<['all']>(),
    pathParams: idParamsSchema,
    responses: {
      200: ratingsResponseSchema,
    },
  },
  stats: {
    path: '/stats',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: showStatsResponseSchema,
    },
  },
  progress: {
    watched: {
      path: '/progress/watched',
      method: 'GET',
      pathParams: idParamsSchema,
      query: extendedQuerySchemaFactory<['full', 'images']>()
        .merge(showQueryParamsSchema)
        .merge(statsQuerySchema),
      responses: {
        200: showProgressResponseSchema,
      },
    },
  },
  translations: {
    path: '/translations/:language',
    method: 'GET',
    pathParams: idParamsSchema.merge(languageParamsSchema),
    responses: {
      200: translationResponseSchema,
    },
  },
  related: {
    path: '/related',
    method: 'GET',
    pathParams: idParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema),
    responses: {
      200: showResponseSchema.array(),
    },
  },
  watching: {
    path: '/watching',
    method: 'GET',
    pathParams: idParamsSchema,
    query: extendedQuerySchemaFactory<['full']>(),
    responses: {
      200: profileResponseSchema.array(),
    },
  },
  studios: {
    path: '/studios',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: studioResponseSchema.array(),
    },
  },
  watchnow: {
    path: '/watchnow/:country',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: watchNowResponseSchema,
    },
  },
  people: {
    path: '/people',
    method: 'GET',
    query: extendedQuerySchemaFactory<['images']>(),
    pathParams: idParamsSchema,
    responses: {
      200: peopleResponseSchema,
    },
  },
  seasons: {
    path: '/seasons',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    pathParams: idParamsSchema,
    responses: {
      200: seasonResponseSchema.array(),
    },
  },
  episodes: {
    path: '/seasons/:season',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    pathParams: idParamsSchema
      .merge(seasonParamsSchema),
    responses: {
      200: episodeResponseSchema.array(),
    },
  },
  lists: {
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
    path: '/comments/:sort',
    method: 'GET',
    pathParams: idParamsSchema.merge(commentsSortParamsSchema),
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: commentResponseSchema.array(),
    },
  },
  episode: EPISODE_LEVEL,
}, {
  pathPrefix: '/:id',
});

const GLOBAL_LEVEL = builder.router({
  trending: {
    path: '/trending',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: showTrendingResponseSchema.array(),
    },
  },
  watched: {
    path: '/watched/:period',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    pathParams: periodParamsSchema,
    responses: {
      200: showWatchedResponseSchema.array(),
    },
  },
  anticipated: {
    path: '/anticipated',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: showAnticipatedResponseSchema.array(),
    },
  },
  popular: {
    path: '/popular',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: showResponseSchema.array(),
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
export type ShowRatingsResponse = z.infer<typeof ratingsResponseSchema>;
export type ShowResponse = z.infer<typeof showResponseSchema>;
export type ShowProgressResponse = z.infer<typeof showProgressResponseSchema>;
export type ShowQueryParams = z.infer<typeof showQueryParamsSchema>;
export type ShowTrendingResponse = z.infer<typeof showTrendingResponseSchema>;
export type ShowWatchedResponse = z.infer<typeof showWatchedResponseSchema>;
export type ShowStatsResponse = z.infer<typeof showStatsResponseSchema>;
export type ShowAnticipatedResponse = z.infer<
  typeof showAnticipatedResponseSchema
>;
export type ShowTranslationResponse = z.infer<
  typeof translationResponseSchema
>;
export type EpisodeTranslationResponse = z.infer<
  typeof episodeTranslationResponseSchema
>;
export type ShowCertificationResponse = z.infer<
  typeof showCertificationResponseSchema
>;
export type SeasonsResponse = z.infer<typeof seasonResponseSchema>[];
export type SeasonResponse = z.infer<typeof episodeResponseSchema>[];
export type EpisodeResponse = z.infer<typeof episodeResponseSchema>;
export type EpisodeStatsResponse = z.infer<typeof episodeStatsResponseSchema>;
