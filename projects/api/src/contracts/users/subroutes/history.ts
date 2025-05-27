import { builder } from '../../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../../_internal/request/extendedMediaQuerySchema.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import type { z } from '../../_internal/z.ts';
import { dateRangeParamsSchema } from '../_internal/request/dateRangeParamsSchema.ts';
import { historyItemIdParamsSchema } from '../_internal/request/historyItemIdParamsSchema.ts';
import { profileParamsSchema } from '../_internal/request/profileParamsSchema.ts';
import { activityHistoryResponseSchema } from '../_internal/response/activityHistoryResponseSchema.ts';
import { episodeActivityHistoryResponseSchema } from '../_internal/response/episodeActivityHistoryResponseSchema.ts';
import { movieActivityHistoryResponseSchema } from '../_internal/response/movieActivityHistoryResponseSchema.ts';
import { showActivityHistoryResponseSchema } from '../_internal/response/showActivityHistoryResponseSchema.ts';

export const history = builder.router({
  all: {
    path: '/',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedMediaQuerySchema
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: activityHistoryResponseSchema.array(),
    },
  },
  movies: {
    path: '/movies',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedMediaQuerySchema
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: movieActivityHistoryResponseSchema.array(),
    },
  },
  shows: {
    path: '/shows',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedMediaQuerySchema
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: showActivityHistoryResponseSchema.array(),
    },
  },
  episodes: {
    path: '/episodes',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedMediaQuerySchema
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: episodeActivityHistoryResponseSchema.array(),
    },
  },
  movie: {
    path: '/movies/:item_id',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(historyItemIdParamsSchema),
    query: extendedMediaQuerySchema
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: movieActivityHistoryResponseSchema.array(),
    },
  },
  show: {
    path: '/shows/:item_id',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(historyItemIdParamsSchema),
    query: extendedMediaQuerySchema
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: showActivityHistoryResponseSchema.array(),
    },
  },
  episode: {
    path: '/episodes/:item_id',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(historyItemIdParamsSchema),
    query: extendedMediaQuerySchema
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: episodeActivityHistoryResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/:id/history',
});

export type MovieActivityHistoryResponse = z.infer<
  typeof movieActivityHistoryResponseSchema
>;
export type ShowActivityHistoryResponse = z.infer<
  typeof showActivityHistoryResponseSchema
>;
export type ActivityHistoryResponse = z.infer<
  typeof activityHistoryResponseSchema
>;
export type EpisodeActivityHistoryResponse = z.infer<
  typeof episodeActivityHistoryResponseSchema
>;
