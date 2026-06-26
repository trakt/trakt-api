import { builder } from '../../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../../_internal/request/extendedMediaQuerySchema.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import { z } from '../../_internal/z.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';
import { RatedItemResponseSchema } from '../schema/response/ratedItemResponseSchema.ts';

const typedRatingParamsSchema = profileParamsSchema.extend({
  type: z.string().describe('Rated media type filter.'),
  rating: z.string().describe('Rating filter from 1 to 10.'),
});

export const ratings = builder.router({
  movies: {
    summary: 'Get movie ratings',
    description: `#### 🔓 OAuth Optional ✨ Extended Info
Returns movies rated by a user including each rating value and when it was rated.`,
    path: '/movies',
    pathParams: profileParamsSchema,
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema),
    responses: {
      200: RatedItemResponseSchema.array(),
    },
  },
  shows: {
    summary: 'Get show ratings',
    description: `#### 🔓 OAuth Optional ✨ Extended Info
Returns shows rated by a user including each rating value and when it was rated.`,
    path: '/shows',
    pathParams: profileParamsSchema,
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema),
    responses: {
      200: RatedItemResponseSchema.array(),
    },
  },
  episodes: {
    summary: 'Get episode ratings',
    description: `#### 🔓 OAuth Optional ✨ Extended Info
Returns episodes rated by a user including each rating value and when it was rated.`,
    path: '/episodes',
    pathParams: profileParamsSchema,
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema),
    responses: {
      200: RatedItemResponseSchema.array(),
    },
  },
  all: {
    summary: 'Get all ratings',
    description: `#### 🔓 OAuth Optional ✨ Extended Info
Returns all ratings by a user including each rating value and when it was rated.`,
    path: '/',
    pathParams: profileParamsSchema,
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema),
    responses: {
      200: RatedItemResponseSchema.array(),
    },
  },
  typedRating: {
    summary: 'Get ratings',
    description:
      'Returns ratings by a user for the requested media type and rating value.',
    path: '/:type/:rating',
    pathParams: typedRatingParamsSchema,
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema),
    responses: {
      200: RatedItemResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/:id/ratings',
});

export type RatedItemResponse = z.infer<typeof RatedItemResponseSchema>;
