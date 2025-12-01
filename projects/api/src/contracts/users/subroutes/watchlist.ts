import { builder } from '../../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../../_internal/request/extendedMediaQuerySchema.ts';
import { hideFilterParamsSchema } from '../../_internal/request/hideFilterParamsSchema.ts';
import { mediaFilterParamsSchema } from '../../_internal/request/mediaFilterParamsSchema.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import { commentResponseSchema } from '../../_internal/response/commentResponseSchema.ts';
import { listedMediaResponseSchema } from '../../_internal/response/listedMediaResponseSchema.ts';
import { listedMovieResponseSchema } from '../../_internal/response/listedMovieResponseSchema.ts';
import { listedShowResponseSchema } from '../../_internal/response/listedShowResponseSchema.ts';
import { listCommentsSortParamsSchema } from '../schema/request/listCommentsSortParamsSchema.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';
import { sortParamsSchema } from '../schema/request/sortParamsSchema.ts';

export const watchlist = builder.router({
  movies: {
    path: '/movies/:sort',
    pathParams: profileParamsSchema.merge(sortParamsSchema),
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema)
      .merge(mediaFilterParamsSchema)
      .merge(hideFilterParamsSchema),
    responses: {
      200: listedMovieResponseSchema.array(),
    },
  },
  shows: {
    path: '/shows/:sort',
    pathParams: profileParamsSchema.merge(sortParamsSchema),
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema)
      .merge(mediaFilterParamsSchema)
      .merge(hideFilterParamsSchema),
    responses: {
      200: listedShowResponseSchema.array(),
    },
  },
  all: {
    path: '/movie,show/:sort',
    pathParams: profileParamsSchema.merge(sortParamsSchema),
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema)
      .merge(mediaFilterParamsSchema)
      .merge(hideFilterParamsSchema),
    responses: {
      200: listedMediaResponseSchema.array(),
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
  pathPrefix: '/:id/watchlist',
});
