import { builder } from '../../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../../_internal/request/extendedMediaQuerySchema.ts';
import { hideFilterParamsSchema } from '../../_internal/request/hideFilterParamsSchema.ts';
import { mediaFilterParamsSchema } from '../../_internal/request/mediaFilterParamsSchema.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import { sortQuerySchema } from '../../_internal/request/sortQuerySchema.ts';
import { commentResponseSchema } from '../../_internal/response/commentResponseSchema.ts';
import { listedMediaResponseSchema } from '../../_internal/response/listedMediaResponseSchema.ts';
import { listedMovieResponseSchema } from '../../_internal/response/listedMovieResponseSchema.ts';
import { listedShowResponseSchema } from '../../_internal/response/listedShowResponseSchema.ts';
import { z } from '../../_internal/z.ts';
import { listCommentsSortParamsSchema } from '../schema/request/listCommentsSortParamsSchema.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';
import { sortParamsSchema } from '../schema/request/sortParamsSchema.ts';

const typedSortedWatchlistParamsSchema = profileParamsSchema.extend({
  type: z.string().describe('Watchlist media type filter.'),
  sort_by: z.string().describe('Sort by a specific property.'),
  sort_how: z.string().describe('Sort direction.'),
});

export const watchlist = builder.router({
  movies: {
    summary: 'Get movie watchlist',
    description:
      `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
Returns movies on a user watchlist. Use the \`sort\` path parameter plus query sorting, pagination, and filters to control the result order and contents.`,
    path: '/movies/:sort',
    pathParams: profileParamsSchema
      .merge(sortParamsSchema.partial()),
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(sortQuerySchema)
      .merge(pageQuerySchema)
      .merge(mediaFilterParamsSchema)
      .merge(hideFilterParamsSchema),
    responses: {
      200: listedMovieResponseSchema.array(),
    },
  },
  shows: {
    summary: 'Get show watchlist',
    description:
      `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
Returns shows on a user watchlist. Use the \`sort\` path parameter plus query sorting, pagination, and filters to control the result order and contents.`,
    path: '/shows/:sort',
    pathParams: profileParamsSchema
      .merge(sortParamsSchema.partial()),
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(sortQuerySchema)
      .merge(pageQuerySchema)
      .merge(mediaFilterParamsSchema)
      .merge(hideFilterParamsSchema),
    responses: {
      200: listedShowResponseSchema.array(),
    },
  },
  all: {
    summary: 'Get media watchlist',
    description:
      `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
Returns movies and shows on a user watchlist. Use the \`sort\` path parameter plus query sorting, pagination, and filters to control the result order and contents.`,
    path: '/movie,show/:sort',
    pathParams: profileParamsSchema
      .merge(sortParamsSchema.partial()),
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(sortQuerySchema)
      .merge(pageQuerySchema)
      .merge(mediaFilterParamsSchema)
      .merge(hideFilterParamsSchema),
    responses: {
      200: listedMediaResponseSchema.array(),
    },
  },
  typedSorted: {
    summary: 'Get watchlist',
    description:
      `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
Returns all items in a user's watchlist filtered by type.`,
    path: '/:type/:sort_by/:sort_how',
    pathParams: typedSortedWatchlistParamsSchema,
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(sortQuerySchema)
      .merge(pageQuerySchema)
      .merge(mediaFilterParamsSchema)
      .merge(hideFilterParamsSchema),
    responses: {
      200: listedMediaResponseSchema.array(),
    },
  },
  comments: {
    summary: 'Get all watchlist comments',
    description: `#### 🔓 OAuth Optional 📄 Pagination 😁 Emojis

Returns all top level comments for the watchlist. By default, the comments are sorted by most \`likes\`. Other sorting options include \`likes_30\`, most \`replies\`, \`replies_30\`, most \`plays\`, highest \`rating\`, and \`added\` date.

> ### Note
> _If you send OAuth, comments from blocked users will be automatically filtered out._`,
    path: '/comments/:sort',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(listCommentsSortParamsSchema),
    query: pageQuerySchema,
    responses: {
      200: commentResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/:id/watchlist',
});
