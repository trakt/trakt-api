import { builder } from '../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { limitlessQuerySchema } from '../_internal/request/limitlessQuerySchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { likeResponseSchema } from '../_internal/response/likeResponseSchema.ts';
import { listedMovieResponseSchema } from '../_internal/response/listedMovieResponseSchema.ts';
import { listedShowResponseSchema } from '../_internal/response/listedShowResponseSchema.ts';
import { listResponseSchema } from '../_internal/response/listResponseSchema.ts';
import { z } from '../_internal/z.ts';
import { searchTypeParamFactory } from '../search/_internal/request/searchTypeParamFactory.ts';
import { prominentListResponseSchema } from './_internal/prominentListResponseSchema.ts';

const ENTITY_LEVEL = builder.router({
  summary: {
    path: '',
    method: 'GET',
    pathParams: idParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: listResponseSchema,
    },
  },
  items: {
    path: '/items/:type',
    method: 'GET',
    pathParams: idParamsSchema
      .merge(
        searchTypeParamFactory<
          ['movie', 'show']
        >(),
      ),
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .and(pageQuerySchema.or(limitlessQuerySchema)),
    responses: {
      200: z.union([listedMovieResponseSchema, listedShowResponseSchema])
        .array(),
    },
  },
  likes: {
    path: '/likes',
    method: 'GET',
    pathParams: idParamsSchema,
    query: extendedQuerySchemaFactory<['full']>()
      .merge(pageQuerySchema),
    responses: {
      200: likeResponseSchema.array(),
    },
  },
  like: {
    path: '/like',
    method: 'POST',
    pathParams: idParamsSchema,
    body: z.undefined(),
    responses: {
      204: z.undefined(),
    },
  },
  unlike: {
    path: '/like',
    method: 'DELETE',
    pathParams: idParamsSchema,
    body: z.undefined(),
    responses: {
      204: z.undefined(),
    },
  },
}, {
  pathPrefix: '/:id',
});

const GLOBAL_LEVEL = builder.router({
  trending: {
    path: '/trending',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full']>()
      .merge(pageQuerySchema),
    responses: {
      200: prominentListResponseSchema.array(),
    },
  },
  popular: {
    path: '/popular',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full']>()
      .merge(pageQuerySchema),
    responses: {
      200: prominentListResponseSchema.array(),
    },
  },
});

export const lists = builder.router({
  ...GLOBAL_LEVEL,
  ...ENTITY_LEVEL,
}, {
  pathPrefix: '/lists',
});

export type ProminentListResponse = z.infer<typeof prominentListResponseSchema>;
export type ListLikeResponse = z.infer<typeof likeResponseSchema>;
