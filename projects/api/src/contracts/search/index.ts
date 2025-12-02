import { builder } from '../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { z } from '../_internal/z.ts';
import { recentSearchRequestSchema } from './schema/request/recentSearchRequestSchema.ts';
import { searchEngineSchema } from './schema/request/searchEngineSchema.ts';
import { searchQuerySchema } from './schema/request/searchQuerySchema.ts';
import { searchTypeParamFactory } from './schema/request/searchTypeParamFactory.ts';
import { trendingSearchTypeParamFactory } from './schema/request/trendingSearchTypeParamFactory.ts';
import type { searchMovieResponseSchema } from './schema/response/searchMovieResponseSchema.ts';
import type { searchPersonResponseSchema } from './schema/response/searchPersonResponseSchema.ts';
import { searchResultResponseSchema } from './schema/response/searchResultResponseSchema.ts';
import type { searchShowResponseSchema } from './schema/response/searchShowResponseSchema.ts';
import type { trendingSearchMovieResponseSchema } from './schema/response/trendingSearchMovieResponseSchema.ts';
import type { trendingSearchPersonResponseSchema } from './schema/response/trendingSearchPersonResponseSchema.ts';
import { trendingSearchResponseSchema } from './schema/response/trendingSearchResponseSchema.ts';
import type { trendingSearchShowResponseSchema } from './schema/response/trendingSearchShowResponseSchema.ts';
/**
 * TODO: add support for 'episode', 'list'
 */

const recent = builder.router({
  add: {
    path: '/',
    method: 'POST',
    body: recentSearchRequestSchema,
    responses: {
      201: z.undefined(),
    },
  },
  remove: {
    path: '/remove',
    method: 'POST',
    body: recentSearchRequestSchema,
    responses: {
      204: z.undefined(),
    },
  },
}, { pathPrefix: '/recent' });

export const search = builder.router({
  query: {
    path: '/:type',
    method: 'GET',
    pathParams: searchTypeParamFactory<
      ['movie', 'show', 'person']
    >(),
    query: searchQuerySchema
      .merge(searchEngineSchema)
      .merge(pageQuerySchema)
      .merge(
        extendedQuerySchemaFactory<['full,images']>(),
      ),
    responses: {
      200: searchResultResponseSchema.array(),
    },
  },
  trending: {
    path: '/recent_by_id/global/:type',
    method: 'GET',
    pathParams: trendingSearchTypeParamFactory<
      ['movies', 'shows', 'people']
    >(),
    query: pageQuerySchema
      .merge(searchQuerySchema)
      .merge(
        extendedQuerySchemaFactory<['full,images']>(),
      ),
    responses: {
      200: trendingSearchResponseSchema.array(),
    },
  },
  recent,
}, {
  pathPrefix: '/search',
});

export { searchEngineSchema, searchQuerySchema };
export type SearchQueryParams = z.infer<typeof searchQuerySchema>;
export { searchResultResponseSchema };
export type SearchResultResponse = z.infer<typeof searchResultResponseSchema>;
export { searchTypeParamFactory };

export { searchMovieResponseSchema } from './schema/response/searchMovieResponseSchema.ts';
export type SearchMovieResultResponse = z.infer<
  typeof searchMovieResponseSchema
>;
export { searchShowResponseSchema } from './schema/response/searchShowResponseSchema.ts';
export type SearchShowResultResponse = z.infer<typeof searchShowResponseSchema>;

export { searchPersonResponseSchema } from './schema/response/searchPersonResponseSchema.ts';
export type SearchPersonResultResponse = z.infer<
  typeof searchPersonResponseSchema
>;

export { trendingSearchMovieResponseSchema } from './schema/response/trendingSearchMovieResponseSchema.ts';
export type TrendingSearchMovieResultResponse = z.infer<
  typeof trendingSearchMovieResponseSchema
>;

export { trendingSearchShowResponseSchema } from './schema/response/trendingSearchShowResponseSchema.ts';
export type TrendingSearchShowResultResponse = z.infer<
  typeof trendingSearchShowResponseSchema
>;

export { trendingSearchPersonResponseSchema } from './schema/response/trendingSearchPersonResponseSchema.ts';
export type TrendingSearchPersonResultResponse = z.infer<
  typeof trendingSearchPersonResponseSchema
>;

export { recentSearchRequestSchema };
export type RecentSearchRequest = z.infer<typeof recentSearchRequestSchema>;
