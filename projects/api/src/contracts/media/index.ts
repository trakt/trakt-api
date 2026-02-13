import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { ignoreQuerySchema } from '../_internal/request/ignoreQuerySchema.ts';
import { mediaFilterParamsSchema } from '../_internal/request/mediaFilterParamsSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { mediaAnticipatedResponseSchema } from './schema/response/mediaAnticipatedResponseSchema.ts';
import { mediaPopularResponseSchema } from './schema/response/mediaPopularResponseSchema.ts';
import { mediaTrendingResponseSchema } from './schema/response/mediaTrendingResponseSchema.ts';

export const media = builder.router({
  trending: {
    path: '/trending',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: mediaTrendingResponseSchema.array(),
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
      200: mediaAnticipatedResponseSchema.array(),
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
      200: mediaPopularResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/media',
});
