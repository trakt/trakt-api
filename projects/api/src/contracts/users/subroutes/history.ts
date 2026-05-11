import { builder } from '../../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../../_internal/request/extendedMediaQuerySchema.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import type { z } from '../../_internal/z.ts';
import { dateRangeParamsSchema } from '../schema/request/dateRangeParamsSchema.ts';
import { historyItemIdParamsSchema } from '../schema/request/historyItemIdParamsSchema.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';
import { activityHistoryResponseSchema } from '../schema/response/activityHistoryResponseSchema.ts';
import { episodeActivityHistoryResponseSchema } from '../schema/response/episodeActivityHistoryResponseSchema.ts';
import { movieActivityHistoryResponseSchema } from '../schema/response/movieActivityHistoryResponseSchema.ts';
import { showActivityHistoryResponseSchema } from '../schema/response/showActivityHistoryResponseSchema.ts';
import { mediaFilterParamsSchema } from "../../_internal/request/mediaFilterParamsSchema.ts";

export const history = builder.router({
  all: {
    summary: 'Get watched history',
    description: `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
Returns watched history for a user across all supported media types. Use \`start_at\` and \`end_at\` to limit results to a UTC datetime range.`,
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
    summary: 'Get movie watched history',
    description: `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
Returns movie watched history for a user. Use \`start_at\` and \`end_at\` to limit results to a UTC datetime range.`,
    path: '/movies',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: movieActivityHistoryResponseSchema.array(),
    },
  },
  shows: {
    summary: 'Get show watched history',
    description: `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
Returns show watched history for a user. Use \`start_at\` and \`end_at\` to limit results to a UTC datetime range.`,
    path: '/shows',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: showActivityHistoryResponseSchema.array(),
    },
  },
  episodes: {
    summary: 'Get episode watched history',
    description: `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
Returns episode watched history for a user. Use \`start_at\` and \`end_at\` to limit results to a UTC datetime range.`,
    path: '/episodes',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: episodeActivityHistoryResponseSchema.array(),
    },
  },
  movie: {
    summary: 'Get history for a movie',
    description: `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
Returns watched history entries for one movie. Use \`item_id\` to identify the movie and \`start_at\` or \`end_at\` to limit the date range.`,
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
    summary: 'Get history for a show',
    description: `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
Returns watched history entries for one show. Use \`item_id\` to identify the show and \`start_at\` or \`end_at\` to limit the date range.`,
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
    summary: 'Get history for an episode',
    description: `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
Returns watched history entries for one episode. Use \`item_id\` to identify the episode and \`start_at\` or \`end_at\` to limit the date range.`,
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
