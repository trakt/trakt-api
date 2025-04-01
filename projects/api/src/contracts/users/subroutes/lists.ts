import { builder } from '../../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../../_internal/request/extendedQuerySchemaFactory.ts';
import { listRequestSchema } from '../../_internal/request/listRequestSchema.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import { sortQuerySchema } from '../../_internal/request/sortQuerySchema.ts';
import { commentResponseSchema } from '../../_internal/response/commentResponseSchema.ts';
import { likeResponseSchema } from '../../_internal/response/likeResponseSchema.ts';
import { listAddResponseSchema } from '../../_internal/response/listAddResponseSchema.ts';
import { listedMovieResponseSchema } from '../../_internal/response/listedMovieResponseSchema.ts';
import { listedShowResponseSchema } from '../../_internal/response/listedShowResponseSchema.ts';
import { listRemoveResponseSchema } from '../../_internal/response/listRemoveResponseSchema.ts';
import { listResponseSchema } from '../../_internal/response/listResponseSchema.ts';
import { z } from '../../_internal/z.ts';
import { searchTypeParamFactory } from '../../search/_internal/request/searchTypeParamFactory.ts';
import { listCommentsSortParamsSchema } from '../_internal/request/listCommentsSortParamsSchema.ts';
import { listParamsSchema } from '../_internal/request/listParamsSchema.ts';
import { profileParamsSchema } from '../_internal/request/profileParamsSchema.ts';
import { reorderRequestSchema } from '../_internal/request/reorderRequestSchema.ts';
import { reorderListResponseSchema } from '../_internal/response/reorderListResponseSchema.ts';
import { reorderListsResponseSchema } from '../_internal/response/reorderListsResponseSchema.ts';

const list = builder.router({
  summary: {
    path: '/',
    method: 'GET',
    pathParams: profileParamsSchema.merge(listParamsSchema),
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: listResponseSchema,
    },
  },
  items: {
    path: '/items/:type',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(listParamsSchema)
      .merge(
        searchTypeParamFactory<
          ['movie', 'show']
        >(),
      ),
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema)
      .merge(sortQuerySchema),
    responses: {
      200: z.union([listedMovieResponseSchema, listedShowResponseSchema])
        .array(),
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

export const lists = builder.router({
  personal: {
    path: '',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: listResponseSchema.array(),
    },
  },
  collaborations: {
    path: '/collaborations',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'images']>(),
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
  list,
}, {
  pathPrefix: '/:id/lists',
});

export type ListedMovieResponse = z.infer<
  typeof listedMovieResponseSchema
>;
export type ListedShowResponse = z.infer<
  typeof listedShowResponseSchema
>;
export type ReorderRequest = z.infer<typeof reorderRequestSchema>;
export type ReorderListsResponse = z.infer<typeof reorderListsResponseSchema>;
export type ReorderListResponseSchema = z.infer<
  typeof reorderListResponseSchema
>;
export type ListLikesResponse = z.infer<typeof likeResponseSchema>;

export type ListCommentsSortParams = z.infer<
  typeof listCommentsSortParamsSchema
>;
export type ListRequest = z.infer<typeof listRequestSchema>;
export type ListAddResponse = z.infer<typeof listAddResponseSchema>;
export type ListRemoveResponse = z.infer<
  typeof listRemoveResponseSchema
>;
