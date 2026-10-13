import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { recommendedShowResponse } from '../recommendations/index.ts';
import { recommendationsQuerySchema } from '../recommendations/schema/request/recommendationsQuerySchema.ts';

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

/** ts-rest contract for the `social_recommendations` endpoints. */
export const social_recommendations = builder.router({
  shows,
}, {
  pathPrefix: '/social_recommendations',
});
