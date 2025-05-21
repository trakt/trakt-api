import { builder } from '../../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../../_internal/request/extendedQuerySchemaFactory.ts';
import type { z } from '../../_internal/z.ts';
import { showQueryParamsSchema } from '../../shows/_internal/request/showQueryParamsSchema.ts';
import { profileParamsSchema } from '../_internal/request/profileParamsSchema.ts';
import { watchedMoviesResponseSchema } from '../_internal/response/watchedMoviesResponseSchema.ts';
import { watchedShowsResponseSchema } from '../_internal/response/watchedShowsResponseSchema.ts';

export const watched = builder.router({
  movies: {
    path: '/movies',
    method: 'GET',
    pathParams: profileParamsSchema,
    responses: {
      200: watchedMoviesResponseSchema,
    },
  },
  shows: {
    path: '/shows',
    method: 'GET',
    query: extendedQuerySchemaFactory<['noseasons']>().merge(
      showQueryParamsSchema,
    ),
    responses: {
      200: watchedShowsResponseSchema,
    },
  },
}, {
  pathPrefix: '/:id/watched',
});

export type WatchedMoviesResponse = z.infer<typeof watchedMoviesResponseSchema>;
export type WatchedShowsResponse = z.infer<typeof watchedShowsResponseSchema>;
