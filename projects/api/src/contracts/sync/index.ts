import { builder } from '../_internal/builder.ts';
import { bulkMediaRequestSchema } from '../_internal/request/bulkMediaRequestSchema.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { sortQuerySchema } from '../_internal/request/sortQuerySchema.ts';
import { statsQuerySchema } from '../_internal/request/statsQuerySchema.ts';
import { ratingsResponseSchema } from '../_internal/response/ratingsResponseSchema.ts';
import type { z } from '../_internal/z.ts';
import { favoriteParamSchema } from './_internal/request/favoritesParamSchema.ts';
import { historyRemoveRequestSchema } from './_internal/request/historyRemoveRequestSchema.ts';
import { ratingsParamSchema } from './_internal/request/ratingsParamSchema.ts';
import { watchlistRequestSchema } from './_internal/request/watchlistRequestSchema.ts';
import { favoritesResponseSchema } from './_internal/response/favoritesResponseSchema.ts';
import { historyRemoveResponseSchema } from './_internal/response/historyRemoveResponseSchema.ts';
import { historyResponseSchema } from './_internal/response/historyResponseSchema.ts';
import { upNextResponseSchema } from './_internal/response/upNextResponseSchema.ts';
import { watchlistRemoveResponseSchema } from './_internal/response/watchlistRemoveResponseSchema.ts';
import { watchlistResponseSchema } from './_internal/response/watchlistResponseSchema.ts';

const progress = builder.router({
  upNext: {
    standard: {
      method: 'GET',
      path: '/up_next',
      query: extendedQuerySchemaFactory<['full', 'images']>()
        .merge(pageQuerySchema)
        .merge(sortQuerySchema)
        .merge(statsQuerySchema),
      responses: {
        200: upNextResponseSchema,
      },
    },
    nitro: {
      method: 'GET',
      path: '/up_next_nitro',
      query: pageQuerySchema,
      responses: {
        200: upNextResponseSchema,
      },
    },
  },
}, { pathPrefix: '/progress' });

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
    body: watchlistRequestSchema,
    responses: {
      201: watchlistResponseSchema,
    },
  },
  remove: {
    method: 'POST',
    path: '/remove',
    body: watchlistRequestSchema,
    responses: {
      200: watchlistRemoveResponseSchema,
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
      201: ratingsResponseSchema,
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
      201: favoritesResponseSchema,
    },
  },
}, {
  pathPrefix: '/favorites',
});

export const sync = builder.router({
  history,
  progress,
  watchlist,
  ratings,
  favorites,
}, { pathPrefix: '/sync' });

export type UpNextResponse = z.infer<typeof upNextResponseSchema>;

export type HistoryAddRequest = z.infer<typeof bulkMediaRequestSchema>;
export type HistoryRemoveRequest = z.infer<typeof historyRemoveRequestSchema>;
export type HistoryResponse = z.infer<typeof historyResponseSchema>;

export type WatchlistRequest = z.infer<typeof watchlistRequestSchema>;
export type WatchlistResponse = z.infer<typeof watchlistResponseSchema>;
export type WatchlistRemoveResponse = z.infer<
  typeof watchlistRemoveResponseSchema
>;

export type RatingsRequest = z.infer<typeof ratingsParamSchema>;
export type RatingsResponse = z.infer<typeof ratingsResponseSchema>;

export type FavoritesRequest = z.infer<typeof favoriteParamSchema>;
export type FavoritesResponse = z.infer<typeof favoritesResponseSchema>;
