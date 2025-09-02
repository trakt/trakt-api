import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { extendedProfileQuerySchema } from '../_internal/request/extendedProfileQuerySchema.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { limitlessQuerySchema } from '../_internal/request/limitlessQuerySchema.ts';
import { mediaFilterParamsSchema } from '../_internal/request/mediaFilterParamsSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { likeResponseSchema } from '../_internal/response/likeResponseSchema.ts';
import { listedMovieResponseSchema } from '../_internal/response/listedMovieResponseSchema.ts';
import { listedShowResponseSchema } from '../_internal/response/listedShowResponseSchema.ts';
import { listResponseSchema } from '../_internal/response/listResponseSchema.ts';
import { z } from '../_internal/z.ts';
import { prominentListResponseSchema } from './schema/prominentListResponseSchema.ts';

const ENTITY_LEVEL = builder.router({
  summary: {
    path: '',
    method: 'GET',
    pathParams: idParamsSchema,
    query: extendedProfileQuerySchema
      .merge(mediaFilterParamsSchema),
    responses: {
      200: listResponseSchema,
    },
  },
  items: {
    movie: {
      path: '/items/movie',
      method: 'GET',
      pathParams: idParamsSchema,
      query: extendedMediaQuerySchema
        .merge(mediaFilterParamsSchema)
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: listedMovieResponseSchema.array(),
      },
    },
    show: {
      path: '/items/show',
      method: 'GET',
      pathParams: idParamsSchema,
      query: extendedMediaQuerySchema
        .merge(mediaFilterParamsSchema)
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: listedShowResponseSchema.array(),
      },
    },
    all: {
      path: '/items/movie,show',
      method: 'GET',
      pathParams: idParamsSchema,
      query: extendedMediaQuerySchema
        .merge(mediaFilterParamsSchema)
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: z.union([listedMovieResponseSchema, listedShowResponseSchema])
          .array(),
      },
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
      .merge(pageQuerySchema)
      .merge(mediaFilterParamsSchema),
    responses: {
      200: prominentListResponseSchema.array(),
    },
  },
  popular: {
    path: '/popular',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full']>()
      .merge(pageQuerySchema)
      .merge(mediaFilterParamsSchema),
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

export { prominentListResponseSchema };

export type ProminentListResponse = z.infer<typeof prominentListResponseSchema>;
