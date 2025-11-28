import { builder } from '../../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../../_internal/request/extendedMediaQuerySchema.ts';
import { extendedProfileQuerySchema } from '../../_internal/request/extendedProfileQuerySchema.ts';
import { limitlessQuerySchema } from '../../_internal/request/limitlessQuerySchema.ts';
import { listRequestSchema } from '../../_internal/request/listRequestSchema.ts';
import { mediaFilterParamsSchema } from '../../_internal/request/mediaFilterParamsSchema.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import { sortQuerySchema } from '../../_internal/request/sortQuerySchema.ts';
import { commentResponseSchema } from '../../_internal/response/commentResponseSchema.ts';
import { likeResponseSchema } from '../../_internal/response/likeResponseSchema.ts';
import { listAddResponseSchema } from '../../_internal/response/listAddResponseSchema.ts';
import { listedMediaResponseSchema } from '../../_internal/response/listedMediaResponseSchema.ts';
import { listedMovieResponseSchema } from '../../_internal/response/listedMovieResponseSchema.ts';
import { listedShowResponseSchema } from '../../_internal/response/listedShowResponseSchema.ts';
import { listRemoveResponseSchema } from '../../_internal/response/listRemoveResponseSchema.ts';
import { listResponseSchema } from '../../_internal/response/listResponseSchema.ts';
import { z } from '../../_internal/z.ts';
import { createListRequestSchema } from '../schema/request/createListRequestSchema.ts';
import { listCommentsSortParamsSchema } from '../schema/request/listCommentsSortParamsSchema.ts';
import { listParamsSchema } from '../schema/request/listParamsSchema.ts';
import { listUpdateRequestSchema } from '../schema/request/listUpdateRequestSchema.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';
import { reorderRequestSchema } from '../schema/request/reorderRequestSchema.ts';
import { reorderListResponseSchema } from '../schema/response/reorderListResponseSchema.ts';
import { reorderListsResponseSchema } from '../schema/response/reorderListsResponseSchema.ts';

const list = builder.router({
  summary: {
    path: '/',
    method: 'GET',
    pathParams: profileParamsSchema.merge(listParamsSchema),
    query: extendedProfileQuerySchema,
    responses: {
      200: listResponseSchema,
    },
  },
  update: {
    path: '/',
    method: 'PUT',
    pathParams: profileParamsSchema.merge(listParamsSchema),
    body: listUpdateRequestSchema.merge(sortQuerySchema),
    responses: {
      200: listResponseSchema.array(),
    },
  },
  delete: {
    path: '/',
    method: 'DELETE',
    pathParams: profileParamsSchema.merge(listParamsSchema),
    responses: {
      204: z.undefined(),
      403: z.undefined(),
    },
  },
  items: {
    movie: {
      path: '/items/movie',
      method: 'GET',
      pathParams: profileParamsSchema.merge(listParamsSchema),
      query: extendedMediaQuerySchema
        .merge(sortQuerySchema)
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
      pathParams: profileParamsSchema.merge(listParamsSchema),
      query: extendedMediaQuerySchema
        .merge(sortQuerySchema)
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
      pathParams: profileParamsSchema
        .merge(listParamsSchema),
      query: extendedMediaQuerySchema
        .merge(sortQuerySchema)
        .merge(mediaFilterParamsSchema)
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: listedMediaResponseSchema.array(),
      },
    },
  },
  add: {
    path: '/items',
    method: 'POST',
    body: listRequestSchema,
    responses: {
      201: listAddResponseSchema,
      420: z.undefined(),
    },
  },
  remove: {
    path: '/items/remove',
    method: 'POST',
    body: listRequestSchema,
    responses: {
      200: listRemoveResponseSchema,
    },
  },
  reorder: {
    path: '/reorder',
    method: 'POST',
    pathParams: profileParamsSchema
      .merge(listParamsSchema),
    body: reorderRequestSchema,
    responses: {
      200: reorderListResponseSchema,
    },
  },
  likes: {
    path: '/likes',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(listParamsSchema),
    query: pageQuerySchema,
    responses: {
      200: likeResponseSchema.array(),
    },
  },
  comments: {
    path: '/comments/:sort',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(listParamsSchema)
      .merge(listCommentsSortParamsSchema),
    query: pageQuerySchema,
    responses: {
      200: commentResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/:list_id',
});

export const userLists = builder.router({
  personal: {
    path: '',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedProfileQuerySchema
      .merge(pageQuerySchema),
    responses: {
      200: listResponseSchema.array(),
    },
  },
  collaborations: {
    path: '/collaborations',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedProfileQuerySchema,
    responses: {
      200: listResponseSchema.array(),
    },
  },
  reorder: {
    path: '/reorder',
    method: 'POST',
    body: reorderRequestSchema,
    responses: {
      200: reorderListsResponseSchema,
    },
  },
  create: {
    path: '',
    method: 'POST',
    body: createListRequestSchema,
    responses: {
      201: listResponseSchema,
    },
  },
  list,
}, {
  pathPrefix: '/:id/lists',
});

export type ReorderRequest = z.infer<typeof reorderRequestSchema>;
export type ReorderListsResponse = z.infer<typeof reorderListsResponseSchema>;
export type ReorderListResponseSchema = z.infer<
  typeof reorderListResponseSchema
>;

export type ListCommentsSortParams = z.infer<
  typeof listCommentsSortParamsSchema
>;
export type ListRequest = z.infer<typeof listRequestSchema>;
export type ListUpdateRequest = z.infer<typeof listUpdateRequestSchema>;

export type CreateListRequest = z.infer<typeof createListRequestSchema>;
