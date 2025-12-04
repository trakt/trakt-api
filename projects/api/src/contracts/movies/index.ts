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
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { periodParamsSchema } from '../_internal/request/periodParamsSchema.ts';
import { recentPeriodParamsSchema } from '../_internal/request/recentPeriodParamsSchema.ts';
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
import type { z } from '../_internal/z.ts';
import { movieAnticipatedResponseSchema } from './schema/response/movieAnticipatedResponseSchema.ts';
import { movieHotResponseSchema } from './schema/response/movieHotResponseSchema.ts';
import { movieStreamingResponseSchema } from './schema/response/movieStreamingResponseSchema.ts';
import { movieTrendingResponseSchema } from './schema/response/movieTrendingResponseSchema.ts';
import { movieWatchedResponseSchema } from './schema/response/movieWatchedResponseSchema.ts';

const ENTITY_LEVEL = builder.router({
  summary: {
    path: '',
    method: 'GET',
    query: extendedMediaQuerySchema,
    pathParams: idParamsSchema,
    responses: {
      200: movieResponseSchema,
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
      200: movieStatsResponseSchema,
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
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema),
    pathParams: idParamsSchema,
    responses: {
      200: movieResponseSchema.array(),
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
      path: '/watchnow/justwatch_links/:country',
      method: 'GET',
      pathParams: idParamsSchema,
      responses: {
        200: justWatchLinkResponseSchema,
      },
    },
  }),
  people: {
    path: '/people',
    method: 'GET',
    query: extendedQuerySchemaFactory<['images']>(),
    pathParams: idParamsSchema,
    responses: {
      200: peopleResponseSchema,
    },
  },
  videos: {
    path: '/videos',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: videoResponseSchema.array(),
    },
  },
  lists: {
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
    path: '/sentiments',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: sentimentsResponseSchema,
    },
  },
}, {
  pathPrefix: '/:id',
});

const GLOBAL_LEVEL = builder.router({
  trending: {
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
  anticipated: {
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
