import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { mediaFilterParamsSchema } from '../_internal/request/mediaFilterParamsSchema.ts';
import { z } from '../_internal/z.ts';
import { hideParamsSchema } from './_internal/request/hideParamsSchema.ts';
import { recommendationsQuerySchema } from './_internal/request/recommendationsQuerySchema.ts';
import { recommendedMovieResponse } from './_internal/response/recommendedMovieResponse.ts';
import { recommendedShowResponse } from './_internal/response/recommendedShowResponse.ts';

const movies = builder.router({
  recommend: {
    path: '/',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(recommendationsQuerySchema)
      .merge(mediaFilterParamsSchema),
    responses: {
      200: recommendedMovieResponse,
    },
  },
  hide: {
    path: '/:id',
    method: 'DELETE',
    pathParams: hideParamsSchema,
    responses: {
      204: z.undefined(),
    },
  },
}, { pathPrefix: '/movies' });

const shows = builder.router({
  recommend: {
    path: '/',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(recommendationsQuerySchema)
      .merge(mediaFilterParamsSchema),
    responses: {
      200: recommendedShowResponse,
    },
  },
  hide: {
    path: '/:id',
    method: 'DELETE',
    pathParams: hideParamsSchema,
    responses: {
      204: z.undefined(),
    },
  },
}, { pathPrefix: '/shows' });

export const recommendations = builder.router({
  movies,
  shows,
}, {
  pathPrefix: '/recommendations',
});

export type HideRecommendationParams = z.infer<typeof hideParamsSchema>;
export type RecommendedMovieResponse = z.infer<typeof recommendedMovieResponse>;
export type RecommendedShowResponse = z.infer<typeof recommendedShowResponse>;
