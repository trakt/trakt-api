import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import {
  recommendedMovieResponse,
  recommendedShowResponse,
} from '../recommendations/index.ts';
import { recommendationsQuerySchema } from '../recommendations/schema/request/recommendationsQuerySchema.ts';

const movies = builder.router({
  recommend: {
    summary: 'Get social movie recommendations',
    description: `#### ✨ Extended Info
Returns movie recommendations based on the authenticated user social graph. Use \`limit\`, \`watch_window\`, and ignore flags to tune the recommendation set.`,
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
    summary: 'Get social show recommendations',
    description: `#### ✨ Extended Info
Returns show recommendations based on the authenticated user social graph. Use \`limit\`, \`watch_window\`, and ignore flags to tune the recommendation set.`,
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
