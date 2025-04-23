import { builder } from '../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { recommendationsQuerySchema } from '../recommendations/_internal/request/recommendationsQuerySchema.ts';
import { recommendedMovieResponse } from '../recommendations/_internal/response/recommendedMovieResponse.ts';
import { recommendedShowResponse } from '../recommendations/_internal/response/recommendedShowResponse.ts';

const movies = builder.router({
  recommend: {
    path: '/',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images', 'colors']>()
      .merge(recommendationsQuerySchema),
    responses: {
      200: recommendedMovieResponse,
    },
  },
}, { pathPrefix: '/movies' });

const shows = builder.router({
  recommend: {
    path: '/',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images', 'colors']>()
      .merge(recommendationsQuerySchema),
    responses: {
      200: recommendedShowResponse,
    },
  },
}, { pathPrefix: '/shows' });

export const social_recommendations = builder.router({
  movies,
  shows,
}, {
  pathPrefix: '/social_recommendations',
});
