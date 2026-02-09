import { builder } from '../_internal/builder.ts';
import { bulkMediaRequestSchema } from '../_internal/request/bulkMediaRequestSchema.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { listRequestSchema } from '../_internal/request/listRequestSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { sortQuerySchema } from '../_internal/request/sortQuerySchema.ts';
import { statsQuerySchema } from '../_internal/request/statsQuerySchema.ts';
import { listAddResponseSchema } from '../_internal/response/listAddResponseSchema.ts';
import { listRemoveResponseSchema } from '../_internal/response/listRemoveResponseSchema.ts';
import { z } from '../_internal/z.ts';
import { collectionParamSchema } from './schema/request/collectionParamSchema.ts';
import { favoriteParamSchema } from './schema/request/favoritesParamSchema.ts';
import { historyRemoveRequestSchema } from './schema/request/historyRemoveRequestSchema.ts';
import { minimalParamSchema } from './schema/request/minimalParamSchema.ts';
import { playbackIdParamsSchema } from './schema/request/playbackIdParamsSchema.ts';
import { progressParamsSchema } from './schema/request/progressParamsSchema.ts';
import { ratingsParamSchema } from './schema/request/ratingsParamSchema.ts';
import { removeRatingsParamSchema } from './schema/request/removeRatingsParamSchema.ts';
import { upNextIntentQuerySchema } from './schema/request/upNextIntentQuerySchema.ts';
import {
  collectionMinimalResponseSchema,
  collectionMinimalShowResponseSchema,
} from './schema/response/collectionMinimalResponseSchema.ts';
import {
  collectedEpisodeSchema,
  collectedMovieSchema,
  collectedShowSchema,
  collectionResponseSchema,
} from './schema/response/collectionResponseSchema.ts';
import { favoritesRemoveResponseSchema } from './schema/response/favoritesRemoveResponseSchema.ts';
import { favoritesResponseSchema } from './schema/response/favoritesResponseSchema.ts';
import { historyRemoveResponseSchema } from './schema/response/historyRemoveResponseSchema.ts';
import { historyResponseSchema } from './schema/response/historyResponseSchema.ts';
import { movieProgressResponseSchema } from './schema/response/movieProgressResponseSchema.ts';
import { ratingsSyncResponseSchema } from './schema/response/ratingsResponseSchema.ts';
import { removeRatingsResponseSchema } from './schema/response/removeRatingsResponseSchema.ts';
import { upNextResponseSchema } from './schema/response/upNextResponseSchema.ts';

const progress = builder.router({
  upNext: {
    standard: {
      method: 'GET',
      path: '/progress/up_next',
      query: extendedQuerySchemaFactory<['full', 'images']>()
        .merge(pageQuerySchema)
        .merge(sortQuerySchema)
        .merge(statsQuerySchema),
      responses: {
        200: upNextResponseSchema.array(),
      },
    },
    nitro: {
      method: 'GET',
      path: '/progress/up_next_nitro',
      query: pageQuerySchema
        .merge(upNextIntentQuerySchema),
      responses: {
        200: upNextResponseSchema.array(),
      },
    },
  },
  movies: {
    method: 'GET',
    path: '/playback/movies',
    query: extendedQuerySchemaFactory<['full', 'images', 'available_on']>()
      .merge(pageQuerySchema)
      .merge(progressParamsSchema),
    responses: {
      200: movieProgressResponseSchema.array(),
    },
  },
  drop: {
    movie: {
      path: '/playback/:id',
      method: 'DELETE',
      pathParams: playbackIdParamsSchema,
      responses: {
        204: z.undefined(),
      },
    },
  },
});

const history = builder.router({
  add: {
    method: 'POST',
    path: '',
    body: bulkMediaRequestSchema,
    responses: {
      200: historyResponseSchema,
    },
  },
  remove: {
    method: 'POST',
    path: '/remove',
    body: historyRemoveRequestSchema,
    responses: {
      200: historyRemoveResponseSchema,
    },
  },
}, {
  pathPrefix: '/history',
});

const watchlist = builder.router({
  add: {
    method: 'POST',
    path: '',
    body: listRequestSchema,
    responses: {
      201: listAddResponseSchema,
    },
  },
  remove: {
    method: 'POST',
    path: '/remove',
    body: listRequestSchema,
    responses: {
      200: listRemoveResponseSchema,
    },
  },
}, {
  pathPrefix: '/watchlist',
});

const ratings = builder.router({
  add: {
    method: 'POST',
    path: '',
    body: ratingsParamSchema,
    responses: {
      201: ratingsSyncResponseSchema,
    },
  },
  remove: {
    method: 'POST',
    path: '/remove',
    body: removeRatingsParamSchema,
    responses: {
      200: removeRatingsResponseSchema,
    },
  },
}, {
  pathPrefix: '/ratings',
});

const favorites = builder.router({
  add: {
    method: 'POST',
    path: '',
    body: favoriteParamSchema,
    responses: {
      201: favoritesResponseSchema,
    },
  },
  remove: {
    method: 'POST',
    path: '/remove',
    body: favoriteParamSchema,
    responses: {
      200: favoritesRemoveResponseSchema,
    },
  },
}, {
  pathPrefix: '/favorites',
});

const collection = builder.router({
  movies: {
    method: 'GET',
    path: '/movies',
    query: extendedQuerySchemaFactory<['full', 'images', 'available_on']>()
      .merge(collectionParamSchema)
      .merge(pageQuerySchema),
    responses: {
      200: collectedMovieSchema.array(),
    },
  },
  shows: {
    method: 'GET',
    path: '/shows',
    query: extendedQuerySchemaFactory<['full', 'images', 'available_on']>()
      .merge(collectionParamSchema),
    responses: {
      200: collectedShowSchema.array(),
    },
  },
  episodes: {
    method: 'GET',
    path: '/episodes',
    query: extendedQuerySchemaFactory<['full', 'images', 'available_on']>()
      .merge(collectionParamSchema)
      .merge(pageQuerySchema),
    responses: {
      200: collectedEpisodeSchema.array(),
    },
  },
  media: {
    method: 'GET',
    path: '/media',
    query: extendedQuerySchemaFactory<['full', 'images', 'available_on']>()
      .merge(collectionParamSchema)
      .merge(pageQuerySchema),
    responses: {
      200: collectionResponseSchema,
    },
  },
  minimal: builder.router({
    movies: {
      method: 'GET',
      path: '/movies',
      query: collectionParamSchema,
      responses: {
        200: collectionMinimalResponseSchema,
      },
    },
    shows: {
      method: 'GET',
      path: '/shows',
      query: collectionParamSchema,
      responses: {
        200: collectionMinimalShowResponseSchema,
      },
    },
    episodes: {
      method: 'GET',
      path: '/episodes',
      query: collectionParamSchema,
      responses: {
        200: collectionMinimalResponseSchema,
      },
    },
  }, { pathPrefix: '/minimal' }),
}, {
  pathPrefix: '/collection',
});

export const sync = builder.router({
  history,
  progress,
  watchlist,
  ratings,
  favorites,
  collection,
}, { pathPrefix: '/sync' });

export {
  collectionMinimalResponseSchema,
  collectionMinimalShowResponseSchema,
  collectionParamSchema,
  collectionResponseSchema,
  favoriteParamSchema,
  favoritesRemoveResponseSchema,
  favoritesResponseSchema,
  historyRemoveRequestSchema,
  historyResponseSchema,
  minimalParamSchema,
  movieProgressResponseSchema,
  ratingsParamSchema,
  ratingsSyncResponseSchema,
  removeRatingsParamSchema,
  upNextIntentQuerySchema,
  upNextResponseSchema,
};

export type UpNextResponse = z.infer<typeof upNextResponseSchema>;
export type MovieProgressResponse = z.infer<typeof movieProgressResponseSchema>;
export type UpNextIntentRequest = z.infer<typeof upNextIntentQuerySchema>;

export type HistoryAddRequest = z.infer<typeof bulkMediaRequestSchema>;
export type HistoryRemoveRequest = z.infer<typeof historyRemoveRequestSchema>;
export type HistoryResponse = z.infer<typeof historyResponseSchema>;
export type HistoryRemoveResponse = z.infer<typeof historyRemoveResponseSchema>;

export type WatchlistRequest = z.infer<typeof listRequestSchema>;

export type RatingsSyncRequest = z.infer<typeof ratingsParamSchema>;
export type RatingsSyncResponse = z.infer<typeof ratingsSyncResponseSchema>;

export type FavoritesRequest = z.infer<typeof favoriteParamSchema>;
export type FavoritesResponse = z.infer<typeof favoritesResponseSchema>;
export type FavoritesRemoveResponse = z.infer<
  typeof favoritesRemoveResponseSchema
>;

export type CollectionRequest = z.infer<typeof collectionParamSchema>;
export type CollectionResponse = z.infer<typeof collectionResponseSchema>;
export type CollectionMovieResponse = z.infer<typeof collectedMovieSchema>;
export type CollectionShowResponse = z.infer<typeof collectedShowSchema>;
export type CollectionEpisodeResponse = z.infer<typeof collectedEpisodeSchema>;
export type CollectionMinimalResponse = z.infer<
  typeof collectionMinimalResponseSchema
>;
export type CollectionMinimalShowResponse = z.infer<
  typeof collectionMinimalShowResponseSchema
>;

export type RemoveRatingsParams = z.infer<typeof removeRatingsParamSchema>;
