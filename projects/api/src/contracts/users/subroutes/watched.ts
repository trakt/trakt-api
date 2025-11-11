import { builder } from '../../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../../_internal/request/extendedQuerySchemaFactory.ts';
import type { z } from '../../_internal/z.ts';
import { showQueryParamsSchema } from '../../shows/schema/request/showQueryParamsSchema.ts';
import { minimalParamSchema } from '../../sync/schema/request/minimalParamSchema.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';
import { watchedMoviesMinimalResponseSchema } from '../schema/response/watchedMoviesMinimalResponseSchema.ts';
import { watchedMoviesResponseSchema } from '../schema/response/watchedMoviesResponseSchema.ts';
import { watchedShowsResponseSchema } from '../schema/response/watchedShowsResponseSchema.ts';

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
  minimal: builder.router({
    movies: {
      path: '/movies',
      method: 'GET',
      pathParams: profileParamsSchema,
      query: minimalParamSchema,
      responses: {
        200: watchedMoviesMinimalResponseSchema,
      },
    },
  }),
}, {
  pathPrefix: '/:id/watched',
});

export type WatchedMoviesResponse = z.infer<typeof watchedMoviesResponseSchema>;
export type WatchedShowsResponse = z.infer<typeof watchedShowsResponseSchema>;

export type WatchedMoviesMinimalResponse = z.infer<
  typeof watchedMoviesMinimalResponseSchema
>;
