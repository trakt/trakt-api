import { builder } from '../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import type { z } from '../_internal/z.ts';
import { searchEngineSchema } from './schema/request/searchEngineSchema.ts';
import { searchQuerySchema } from './schema/request/searchQuerySchema.ts';
import { searchTypeParamFactory } from './schema/request/searchTypeParamFactory.ts';
import type { searchMovieResponseSchema } from './schema/response/searchMovieResponseSchema.ts';
import type { searchPersonResponseSchema } from './schema/response/searchPersonResponseSchema.ts';
import { searchResultResponseSchema } from './schema/response/searchResultResponseSchema.ts';
import type { searchShowResponseSchema } from './schema/response/searchShowResponseSchema.ts';
/**
 * TODO: add support for 'episode', 'list'
 */

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
