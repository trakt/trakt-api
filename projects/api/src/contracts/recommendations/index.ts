import { authMetadata, builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { mediaFilterParamsSchema } from '../_internal/request/mediaFilterParamsSchema.ts';
import { z } from '../_internal/z.ts';
import { hideParamsSchema } from './schema/request/hideParamsSchema.ts';
import { recommendationsQuerySchema } from './schema/request/recommendationsQuerySchema.ts';
import { recommendedMovieResponse } from './schema/response/recommendedMovieResponse.ts';
import { recommendedShowResponse } from './schema/response/recommendedShowResponse.ts';

const movies = builder.router({
  recommend: {
    summary: 'Get movie recommendations',
    description: `#### 🔒 OAuth Required ✨ Extended Info
Movie recommendations for a user. By default, \`10\` results are returned. You can send a \`limit\` to get up to \`100\` results per page. Set \`ignore_collected=true\` to filter out movies the user has already collected or \`ignore_watchlisted=true\` to filter out movies the user has already watchlisted.

The \`favorited_by\` array contains all users who favorited the item along with any notes they added.`,
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
    summary: 'Hide a movie recommendation',
    description: `#### 🔒 OAuth Required
Hide a movie from getting recommended anymore.`,
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
    summary: 'Get show recommendations',
    description: `#### 🔒 OAuth Required ✨ Extended Info
TV show recommendations for a user. By default, \`10\` results are returned. You can send a \`limit\` to get up to \`100\` results per page. Set \`ignore_collected=true\` to filter out shows the user has already collected or \`ignore_watchlisted=true\` to filter out shows the user has already watchlisted.

The \`favorited_by\` array contains all users who favorited the item along with any notes they added.`,
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
    summary: 'Hide a show recommendation',
    description: `#### 🔒 OAuth Required
Hide a show from getting recommended anymore.`,
    path: '/:id',
    method: 'DELETE',
    pathParams: hideParamsSchema,
    responses: {
      204: z.undefined(),
    },
  },
}, { pathPrefix: '/shows' });

/** ts-rest contract for the `recommendations` endpoints. */
export const recommendations = builder.router({
  movies,
  shows,
}, {
  pathPrefix: '/recommendations',
  metadata: authMetadata('required'),
});

export { hideParamsSchema };
/** The hide recommendation parameters. */
export type HideRecommendationParams = z.infer<typeof hideParamsSchema>;

export { recommendedMovieResponse };
/** The recommended movie response payload. */
export type RecommendedMovieResponse = z.infer<typeof recommendedMovieResponse>;

export { recommendedShowResponse };
/** The recommended show response payload. */
export type RecommendedShowResponse = z.infer<typeof recommendedShowResponse>;

export { recommendationsQuerySchema };
