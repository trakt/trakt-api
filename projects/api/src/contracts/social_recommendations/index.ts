import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import {
  recommendedMovieResponse,
  recommendedShowResponse,
} from '../recommendations/index.ts';
import { recommendationsQuerySchema } from '../recommendations/schema/request/recommendationsQuerySchema.ts';

const movies = builder.router({
  recommend: {
    path: '/',
    method: 'GET',
    query: extendedMediaQuerySchema
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
    query: extendedMediaQuerySchema
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
