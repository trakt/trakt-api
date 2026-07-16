import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { ignoreQuerySchema } from '../_internal/request/ignoreQuerySchema.ts';
import { mediaFilterParamsSchema } from '../_internal/request/mediaFilterParamsSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import type { z } from '../_internal/z.ts';
import { mediaAnticipatedResponseSchema } from './schema/response/mediaAnticipatedResponseSchema.ts';
import { mediaPopularResponseSchema } from './schema/response/mediaPopularResponseSchema.ts';
import { mediaTrendingResponseSchema } from './schema/response/mediaTrendingResponseSchema.ts';

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
