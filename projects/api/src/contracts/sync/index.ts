import { builder } from '../_internal/builder.ts';
import { bulkMediaRequestSchema } from '../_internal/request/bulkMediaRequestSchema.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { listRequestSchema } from '../_internal/request/listRequestSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { sortQuerySchema } from '../_internal/request/sortQuerySchema.ts';
import { statsQuerySchema } from '../_internal/request/statsQuerySchema.ts';
import { listAddResponseSchema } from '../_internal/response/listAddResponseSchema.ts';
import { listRemoveResponseSchema } from '../_internal/response/listRemoveResponseSchema.ts';
import type { z } from '../_internal/z.ts';
import { collectionParamSchema } from './schema/request/collectionParamSchema.ts';
import { favoriteParamSchema } from './schema/request/favoritesParamSchema.ts';
import { historyRemoveRequestSchema } from './schema/request/historyRemoveRequestSchema.ts';
import { minimalParamSchema } from './schema/request/minimalParamSchema.ts';
import { progressParamsSchema } from './schema/request/progressParamsSchema.ts';
import { ratingsParamSchema } from './schema/request/ratingsParamSchema.ts';
import {
  collectionMinimalResponseSchema,
  collectionMinimalShowResponseSchema,
} from './schema/response/collectionMinimalResponseSchema.ts';
import { collectionResponseSchema } from './schema/response/collectionResponseSchema.ts';
import { favoritesRemoveResponseSchema } from './schema/response/favoritesRemoveResponseSchema.ts';
import { favoritesResponseSchema } from './schema/response/favoritesResponseSchema.ts';
import { historyRemoveResponseSchema } from './schema/response/historyRemoveResponseSchema.ts';
import { historyResponseSchema } from './schema/response/historyResponseSchema.ts';
import { movieProgressResponseSchema } from './schema/response/movieProgressResponseSchema.ts';
import { ratingsSyncResponseSchema } from './schema/response/ratingsResponseSchema.ts';
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
      query: pageQuerySchema,
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
      .merge(collectionParamSchema),
    responses: {
      200: collectionResponseSchema,
    },
  },
  shows: {
    method: 'GET',
    path: '/shows',
    query: extendedQuerySchemaFactory<['full', 'images', 'available_on']>()
      .merge(collectionParamSchema),
    responses: {
      200: collectionResponseSchema,
    },
  },
  episodes: {
    method: 'GET',
    path: '/episodes',
    query: extendedQuerySchemaFactory<['full', 'images', 'available_on']>()
      .merge(collectionParamSchema),
    responses: {
      200: collectionResponseSchema,
    },
  },
  minimal: builder.router({
    movies: {
      method: 'GET',
      path: '/movies',
      query: collectionParamSchema
        .merge(minimalParamSchema),
      responses: {
        200: collectionMinimalResponseSchema,
      },
    },
    shows: {
      method: 'GET',
      path: '/shows',
      query: collectionParamSchema
        .merge(minimalParamSchema),
      responses: {
        200: collectionMinimalShowResponseSchema,
      },
    },
    episodes: {
      method: 'GET',
      path: '/episodes',
      query: collectionParamSchema
        .merge(minimalParamSchema),
      responses: {
        200: collectionMinimalResponseSchema,
      },
    },
  }),
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
  ratingsParamSchema,
  ratingsSyncResponseSchema,
  upNextResponseSchema,
};

export type UpNextResponse = z.infer<typeof upNextResponseSchema>;

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
export type CollectionMinimalResponse = z.infer<
  typeof collectionMinimalResponseSchema
>;
export type CollectionMinimalShowResponse = z.infer<
  typeof collectionMinimalShowResponseSchema
>;
