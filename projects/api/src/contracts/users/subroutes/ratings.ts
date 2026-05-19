import { builder } from '../../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../../_internal/request/extendedMediaQuerySchema.ts';
import type { z } from '../../_internal/z.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';
import { RatedItemResponseSchema } from '../schema/response/ratedItemResponseSchema.ts';

export const ratings = builder.router({
  movies: {
    summary: 'Get movie ratings',
    description: `#### 🔓 OAuth Optional ✨ Extended Info
Returns movies rated by a user including each rating value and when it was rated.`,
    path: '/movies',
    pathParams: profileParamsSchema,
    method: 'GET',
    query: extendedMediaQuerySchema,
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
    query: extendedMediaQuerySchema,
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
    query: extendedMediaQuerySchema,
    responses: {
      200: RatedItemResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/:id/ratings',
});

export type RatedItemResponse = z.infer<typeof RatedItemResponseSchema>;
