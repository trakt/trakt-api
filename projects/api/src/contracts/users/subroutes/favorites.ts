import { builder } from '../../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../../_internal/request/extendedQuerySchemaFactory.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import { commentResponseSchema } from '../../_internal/response/commentResponseSchema.ts';
import { listCommentsSortParamsSchema } from '../_internal/request/listCommentsSortParamsSchema.ts';
import { profileParamsSchema } from '../_internal/request/profileParamsSchema.ts';
import { sortParamsSchema } from '../_internal/request/sortParamsSchema.ts';
import { favoritedMoviesResponseSchema } from '../_internal/response/favoritedMoviesResponseSchema.ts';
import { favoritedShowsResponseSchema } from '../_internal/response/favoritedShowsResponseSchema.ts';

export const favorites = builder.router({
  movies: {
    path: '/movies/:sort',
    pathParams: profileParamsSchema.merge(sortParamsSchema),
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: favoritedMoviesResponseSchema.array(),
    },
  },
  shows: {
    path: '/shows/:sort',
    pathParams: profileParamsSchema.merge(sortParamsSchema),
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: favoritedShowsResponseSchema.array(),
    },
  },
  comments: {
    path: '/comments/:sort',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(listCommentsSortParamsSchema),
    query: pageQuerySchema,
    responses: {
      200: commentResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/:id/favorites',
});
