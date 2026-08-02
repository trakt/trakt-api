import { authMetadata, builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { ignoreQuerySchema } from '../_internal/request/ignoreQuerySchema.ts';
import { mediaFilterParamsSchema } from '../_internal/request/mediaFilterParamsSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { periodParamsSchema } from '../_internal/request/periodParamsSchema.ts';
import { recentPeriodParamsSchema } from '../_internal/request/recentPeriodParamsSchema.ts';
import { recommendationsFilterParamsSchema } from '../_internal/request/recommendationsFilterParamsSchema.ts';
import { z } from '../_internal/z.ts';
import { mediaAnticipatedResponseSchema } from './schema/response/mediaAnticipatedResponseSchema.ts';
import { mediaFavoritedResponseSchema } from './schema/response/mediaFavoritedResponseSchema.ts';
import { mediaPopularNextResponseSchema } from './schema/response/mediaPopularNextResponseSchema.ts';
import { mediaPopularResponseSchema } from './schema/response/mediaPopularResponseSchema.ts';
import { mediaRecommendationResponseSchema } from './schema/response/mediaRecommendationResponseSchema.ts';
import { mediaRecommendationSourceResponseSchema } from './schema/response/mediaRecommendationSourceResponseSchema.ts';
import { mediaStreamingResponseSchema } from './schema/response/mediaStreamingResponseSchema.ts';
import { mediaTrendingResponseSchema } from './schema/response/mediaTrendingResponseSchema.ts';
import { mediaWatchedResponseSchema } from './schema/response/mediaWatchedResponseSchema.ts';

const recommendationsWatchWindowQuerySchema = z.object({
  watch_window: z.number().int().nullish().openapi({
    description:
      "The number of the user's most recently watched titles used to seed recommendations.",
  }),
});

/** ts-rest contract for the `media` endpoints. */
export const media = builder.router({
  trending: {
    summary: 'Get trending media',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns trending movies and shows. Results are ordered by current watcher activity and can be filtered by media fields or ignored user state.`,
    path: '/trending',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: mediaTrendingResponseSchema.array(),
    },
  },
  anticipated: {
    summary: 'Get anticipated media',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns anticipated movies and shows based on list activity. Results can be filtered by media fields or ignored user state.`,
    path: '/anticipated',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: mediaAnticipatedResponseSchema.array(),
    },
  },
  favorited: {
    summary: 'Get the most favorited media',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns the most favorited movies and shows in the specified time \`period\`, defaulting to \`weekly\`.`,
    path: '/favorited/:period',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    pathParams: periodParamsSchema,
    responses: {
      200: mediaFavoritedResponseSchema.array(),
    },
  },
  favoritedDefault: {
    summary: 'Get the most favorited media',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns the most favorited movies and shows, defaulting to the \`weekly\` time period.`,
    path: '/favorited',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: mediaFavoritedResponseSchema.array(),
    },
  },
  played: {
    summary: 'Get the most played media',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns the most played movies and shows in the specified time \`period\`, defaulting to \`weekly\`.`,
    path: '/played/:period',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    pathParams: periodParamsSchema,
    responses: {
      200: mediaWatchedResponseSchema.array(),
    },
  },
  playedDefault: {
    summary: 'Get the most played media',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns the most played movies and shows, defaulting to the \`weekly\` time period.`,
    path: '/played',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: mediaWatchedResponseSchema.array(),
    },
  },
  watched: {
    summary: 'Get the most watched media',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns the most watched (unique users) movies and shows in the specified time \`period\`, defaulting to \`weekly\`. All stats are relative to the specific time \`period\`.`,
    path: '/watched/:period',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    pathParams: periodParamsSchema,
    responses: {
      200: mediaWatchedResponseSchema.array(),
    },
  },
  watchedDefault: {
    summary: 'Get the most watched media',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns the most watched (unique users) movies and shows, defaulting to the \`weekly\` time period. All stats are relative to the specific time period.`,
    path: '/watched',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: mediaWatchedResponseSchema.array(),
    },
  },
  collected: {
    summary: 'Get the most collected media',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns the most collected movies and shows in the specified time \`period\`, defaulting to \`weekly\`.`,
    path: '/collected/:period',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    pathParams: periodParamsSchema,
    responses: {
      200: mediaWatchedResponseSchema.array(),
    },
  },
  collectedDefault: {
    summary: 'Get the most collected media',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns the most collected movies and shows, defaulting to the \`weekly\` time period.`,
    path: '/collected',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: mediaWatchedResponseSchema.array(),
    },
  },
  popularNext: {
    summary: 'Get popular media with stats',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns the same popular ranking as the popular endpoint, with rank, play and watcher counts on each entry. Results can be filtered by media fields or ignored user state.`,
    path: '/popular/next',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: mediaPopularNextResponseSchema.array(),
    },
  },
  popular: {
    summary: 'Get popular media',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns popular movies and shows. Results can be filtered by media fields or ignored user state.`,
    path: '/popular',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: mediaPopularResponseSchema.array(),
    },
  },
  streaming: {
    summary: 'Get streaming media',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns movies and shows recently available on streaming services for the requested \`period\`. Results can be filtered by media fields or ignored user state.`,
    path: '/streaming/:period',
    method: 'GET',
    pathParams: recentPeriodParamsSchema,
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: mediaStreamingResponseSchema.array(),
    },
  },
  streamingDefault: {
    summary: 'Get streaming media',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters
Returns movies and shows recently available on streaming services, defaulting to the \`weekly\` time period. Results can be filtered by media fields or ignored user state.`,
    path: '/streaming',
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(pageQuerySchema)
      .merge(ignoreQuerySchema),
    responses: {
      200: mediaStreamingResponseSchema.array(),
    },
  },
  recommendations: {
    summary: 'Get media recommendations for a user',
    description: `#### 🔒 OAuth Required 🎚 Filters

Returns personalized movie and show recommendations for the authenticated user, scored and annotated with the activity, favorites, and shared subgenres that produced each one. \`ignore_watched\` defaults to true.`,
    path: '/recommendations',
    method: 'GET',
    query: recommendationsFilterParamsSchema
      .merge(pageQuerySchema.omit({ page: true }))
      .merge(ignoreQuerySchema)
      .merge(recommendationsWatchWindowQuerySchema),
    metadata: authMetadata('required'),
    responses: {
      200: mediaRecommendationResponseSchema.array(),
    },
  },
  recommendationsSmart: {
    summary: 'Get media recommendations for a user (smart alias)',
    description: `#### 🔒 OAuth Required 🎚 Filters

Alias of [**recommendations**](#reference/media/recommendations) kept for clients pinned to the pre-default \`/smart\` path. \`ignore_watched\` defaults to true.`,
    path: '/recommendations/smart',
    method: 'GET',
    query: recommendationsFilterParamsSchema
      .merge(pageQuerySchema.omit({ page: true }))
      .merge(ignoreQuerySchema)
      .merge(recommendationsWatchWindowQuerySchema),
    metadata: authMetadata('required'),
    responses: {
      200: mediaRecommendationResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/media',
});

/** The media popular response payload. */
export type MediaPopularResponse = z.infer<typeof mediaPopularResponseSchema>;
/** The media trending response payload. */
export type MediaTrendingResponse = z.infer<typeof mediaTrendingResponseSchema>;
/** The media anticipated response payload. */
export type MediaAnticipatedResponse = z.infer<
  typeof mediaAnticipatedResponseSchema
>;

export { mediaFavoritedResponseSchema };
/** The media favorited response payload. */
export type MediaFavoritedResponse = z.infer<
  typeof mediaFavoritedResponseSchema
>;

export { mediaWatchedResponseSchema };
/** The media watched response payload. */
export type MediaWatchedResponse = z.infer<typeof mediaWatchedResponseSchema>;

export { mediaStreamingResponseSchema };
/** The media streaming response payload. */
export type MediaStreamingResponse = z.infer<
  typeof mediaStreamingResponseSchema
>;

export { mediaPopularNextResponseSchema };
/** The media popular/next response payload. */
export type MediaPopularNextResponse = z.infer<
  typeof mediaPopularNextResponseSchema
>;

export { mediaRecommendationResponseSchema };
/** The media recommendation response payload. */
export type MediaRecommendationResponse = z.infer<
  typeof mediaRecommendationResponseSchema
>;

export { mediaRecommendationSourceResponseSchema };
/** The media recommendation source response payload. */
export type MediaRecommendationSourceResponse = z.infer<
  typeof mediaRecommendationSourceResponseSchema
>;
