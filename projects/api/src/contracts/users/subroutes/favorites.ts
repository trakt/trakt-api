import { builder } from '../../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../../_internal/request/extendedMediaQuerySchema.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import { sortQuerySchema } from '../../_internal/request/sortQuerySchema.ts';
import { commentResponseSchema } from '../../_internal/response/commentResponseSchema.ts';
import { z } from '../../_internal/z.ts';
import { listCommentsSortParamsSchema } from '../schema/request/listCommentsSortParamsSchema.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';
import { sortParamsSchema } from '../schema/request/sortParamsSchema.ts';
import { favoritedMoviesResponseSchema } from '../schema/response/favoritedMoviesResponseSchema.ts';
import { favoritedShowsResponseSchema } from '../schema/response/favoritedShowsResponseSchema.ts';

export const favorites = builder.router({
  media: {
    summary: 'Get favorite media',
    description: `#### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
Returns favorite movies and shows for a user. Use the \`sort\` path parameter plus query sorting and pagination to control the result order.`,
    path: '/media/:sort',
    pathParams: profileParamsSchema.merge(sortParamsSchema.partial()),
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(sortQuerySchema)
      .merge(pageQuerySchema),
    responses: {
      200: z.union([
        favoritedShowsResponseSchema,
        favoritedMoviesResponseSchema,
      ]).array(),
    },
  },
  movies: {
    summary: 'Get favorite movies',
    description: `#### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
Returns favorite movies for a user. Use the \`sort\` path parameter plus query sorting and pagination to control the result order.`,
    path: '/movies/:sort',
    pathParams: profileParamsSchema.merge(sortParamsSchema.partial()),
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(sortQuerySchema)
      .merge(pageQuerySchema),
    responses: {
      200: favoritedMoviesResponseSchema.array(),
    },
  },
  shows: {
    summary: 'Get favorite shows',
    description: `#### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
Returns favorite shows for a user. Use the \`sort\` path parameter plus query sorting and pagination to control the result order.`,
    path: '/shows/:sort',
    pathParams: profileParamsSchema.merge(sortParamsSchema.partial()),
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(sortQuerySchema)
      .merge(pageQuerySchema),
    responses: {
      200: favoritedShowsResponseSchema.array(),
    },
  },
  comments: {
    summary: 'Get all favorites comments',
    description: `#### 🔓 OAuth Optional 📄 Pagination 😁 Emojis

Returns all top level comments for the favorites. By default, the comments are sorted by most \`likes\`. Other sorting options include \`likes_30\`, most \`replies\`, \`replies_30\`, most \`plays\`, highest \`rating\`, and \`added\` date.

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
  pathPrefix: '/:id/favorites',
});

export type FavoriteShowResponse = z.infer<typeof favoritedShowsResponseSchema>;
export type FavoriteMovieResponse = z.infer<
  typeof favoritedMoviesResponseSchema
>;
