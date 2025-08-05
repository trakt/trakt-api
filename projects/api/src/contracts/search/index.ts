import { builder } from '../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import type { z } from '../_internal/z.ts';
import { searchQuerySchema } from './_internal/request/searchQuerySchema.ts';
import { searchTypeParamFactory } from './_internal/request/searchTypeParamFactory.ts';
import { searchResultResponseSchema } from './_internal/response/searchResultResponseSchema.ts';

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
