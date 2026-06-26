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
 * TODO: add support for 'episode'
 */

const recent = builder.router({
  add: {
    summary: 'Add recent search',
    description: `#### 🔒 OAuth Required
Add a recent search for the authenticated user. Send the search request body; a successful create returns \`201\` with no response body.`,
    path: '/',
    method: 'POST',
    body: recentSearchRequestSchema,
    responses: {
      201: z.undefined(),
    },
  },
  remove: {
    summary: 'Remove recent search',
    description: `#### 🔒 OAuth Required
Remove a recent search for the authenticated user. Send the search request body; a successful delete returns \`204\` with no response body.`,
    path: '/remove',
    method: 'POST',
    body: recentSearchRequestSchema,
    responses: {
      204: z.undefined(),
    },
  },
}, { pathPrefix: '/recent' });

const idLookupParamsSchema = z.object({
  id_type: z.string().describe('External ID type to look up.'),
  id: z.string().describe('External ID value.'),
});

const idLookupQuerySchema = z.object({
  type: z.string().optional().describe('Optional media type filter.'),
});

export const search = builder.router({
  query: {
    summary: 'Get text query results',
    description: `#### 📄 Pagination ✨ Extended Info

Search all text fields that a media object contains (i.e. title, overview, etc). Results are ordered by the most relevant score. Specify the \`type\` of results by sending a single value or a comma delimited string for multiple types.

#### Special Characters

Our search engine gives the following characters special meaning when they appear in a query:

\`+ - && || ! ( ) { } [ ] ^ " ~ * ? : /\`

To interpret any of these characters literally (and not as a special character), precede the character with a backslash \`\\\` character.

#### Search Fields

By default, certain text fields are used to search for the \`query\`. You can optionally specify the \`fields\` parameter with a single value or comma delimited string for multiple fields. Each \`type\` has specific \`fields\` that can be specified. This can be useful if you want to support more strict searches (i.e. title only).

| Type | Field | Default |
|---|---|---|
| \`movie\` | \`title\` | &#10003; |
|  | \`original_title\` | &#10003; |
|  | \`translations\` | &#10003; |
|  | \`aliases\` | &#10003; |
|  | \`tagline\` | |
|  | \`overview\` | |
|  | \`people\` | |
| \`show\` | \`title\` | &#10003; |
|  | \`original_title\` | &#10003; |
|  | \`translations\` | &#10003; |
|  | \`aliases\` | &#10003; |
|  | \`overview\` | |
|  | \`people\` | |
| \`episode\` | \`title\` | &#10003; |
|  | \`show_title\` | &#10003; |
|  | \`overview\` | |
| \`person\` | \`name\` | &#10003; |
|  | \`biography\` | |
| \`list\` | \`name\` | &#10003; |
|  | \`description\` | &#10003; |`,
    path: '/:type',
    method: 'GET',
    pathParams: searchTypeParamFactory<
      ['movie', 'show', 'person', 'list']
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
  exact: {
    summary: 'Get exact text query results',
    description: `#### 📄 Pagination ✨ Extended Info
Search for exact movie or show matches using the requested search \`type\` and \`query\`. Results are paginated and can include extended media details.`,
    path: '/:type/exact',
    method: 'GET',
    pathParams: searchTypeParamFactory<
      ['movie', 'show']
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
  lookup: {
    summary: 'Get ID lookup results',
    description: `#### 📄 Pagination ✨ Extended Info
Lookup items by external ID. Use \`id_type\` and \`id\` to identify the external ID, and optionally send \`type\` to limit the result media type.`,
    path: '/:id_type/:id',
    method: 'GET',
    pathParams: idLookupParamsSchema,
    query: idLookupQuerySchema
      .merge(pageQuerySchema)
      .merge(
        extendedQuerySchemaFactory<['full,images']>(),
      ),
    responses: {
      200: searchResultResponseSchema.array(),
    },
  },
  trending: {
    summary: 'Get trending search results',
    description: `#### 📄 Pagination ✨ Extended Info
Returns globally trending recent searches by \`type\`. Use \`query\` to narrow the search text and pagination to move through the result set.`,
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
