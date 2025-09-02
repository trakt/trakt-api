import { builder } from '../../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../../_internal/request/extendedMediaQuerySchema.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import { commentResponseSchema } from '../../_internal/response/commentResponseSchema.ts';
import type { z } from '../../_internal/z.ts';
import { listCommentsSortParamsSchema } from '../schema/request/listCommentsSortParamsSchema.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';
import { sortParamsSchema } from '../schema/request/sortParamsSchema.ts';
import { favoritedMoviesResponseSchema } from '../schema/response/favoritedMoviesResponseSchema.ts';
import { favoritedShowsResponseSchema } from '../schema/response/favoritedShowsResponseSchema.ts';

export const favorites = builder.router({
  movies: {
    path: '/movies/:sort',
    pathParams: profileParamsSchema.merge(sortParamsSchema),
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema),
    responses: {
      200: favoritedMoviesResponseSchema.array(),
    },
  },
  shows: {
    path: '/shows/:sort',
    pathParams: profileParamsSchema.merge(sortParamsSchema),
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema),
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

export type FavoriteShowResponse = z.infer<typeof favoritedShowsResponseSchema>;
export type FavoriteMovieResponse = z.infer<
  typeof favoritedMoviesResponseSchema
>;
