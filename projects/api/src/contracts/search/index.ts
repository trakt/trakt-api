import { builder } from '../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import type { z } from '../_internal/z.ts';
import { searchQuerySchema } from './schema/request/searchQuerySchema.ts';
import { searchTypeParamFactory } from './schema/request/searchTypeParamFactory.ts';
import { searchResultResponseSchema } from './schema/response/searchResultResponseSchema.ts';
import { searchEngineSchema } from "./schema/request/searchEngineSchema.ts";

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
      200: searchResultResponseSchema,
    },
  },
}, {
  pathPrefix: '/search',
});

export type SearchQueryParams = z.infer<typeof searchQuerySchema>;
export type SearchResultResponse = z.infer<typeof searchResultResponseSchema>;
