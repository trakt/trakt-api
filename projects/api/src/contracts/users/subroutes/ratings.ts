import { builder } from '../../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../../_internal/request/extendedQuerySchemaFactory.ts';
import type { z } from '../../_internal/z.ts';
import { profileParamsSchema } from '../_internal/request/profileParamsSchema.ts';
import { RatedItemResponseSchema } from '../_internal/response/ratedItemResponseSchema.ts';

export const ratings = builder.router({
  movies: {
    path: '/movies',
    pathParams: profileParamsSchema,
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: RatedItemResponseSchema.array(),
    },
  },
  shows: {
    path: '/shows',
    pathParams: profileParamsSchema,
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: RatedItemResponseSchema.array(),
    },
  },
  episodes: {
    path: '/episodes',
    pathParams: profileParamsSchema,
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: RatedItemResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/:id/ratings',
});

export type RatedItemResponse = z.infer<typeof RatedItemResponseSchema>;
