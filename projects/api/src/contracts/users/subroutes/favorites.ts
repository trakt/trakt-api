import { builder } from '../../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../../_internal/request/extendedMediaQuerySchema.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import { sortQuerySchema } from '../../_internal/request/sortQuerySchema.ts';
import { commentResponseSchema } from '../../_internal/response/commentResponseSchema.ts';
import { movieResponseSchema } from '../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../_internal/response/showResponseSchema.ts';
import { z } from '../../_internal/z.ts';
import { listCommentsSortParamsSchema } from '../schema/request/listCommentsSortParamsSchema.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';
import { sortParamsSchema } from '../schema/request/sortParamsSchema.ts';
import { favoritedMoviesResponseSchema } from '../schema/response/favoritedMoviesResponseSchema.ts';
import { favoritedShowsResponseSchema } from '../schema/response/favoritedShowsResponseSchema.ts';

const favoritesByTypeParamsSchema = profileParamsSchema.extend({
  type: z.string().describe('Favorites media type filter.'),
});

const favoritesByTypeSortParamsSchema = favoritesByTypeParamsSchema.extend({
  sort_by: z.string().describe('Sort by a specific property.'),
});

const typedSortedFavoritesParamsSchema = favoritesByTypeSortParamsSchema.extend(
  {
    sort_how: z.string().describe('Sort direction.'),
  },
);

/**
 * A single favorited item: a movie or a show, as one flat object with the
 * shape-specific fields nullish. Discriminate by which of `movie` / `show`
 * is present.
 */
const favoritedItemResponseSchema = z.object({
  id: z.number().int(),
  listed_at: z.string().datetime(),
  notes: z.string().nullish(),
  rank: z.number().int(),
  /**
   * Available when sorting by `my_rating`; always present, `null` for any
   * other sort.
   */
  my_rating: z.number().int().nullish(),
  type: z.enum(['movie', 'show']),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});

/** ts-rest contract for the `favorites` endpoints. */
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
      200: favoritedItemResponseSchema.array(),
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
  typedSorted: {
    summary: 'Get favorites',
    description:
      `#### 🔒 OAuth Required 📄 Pagination Optional ✨ Extended Info 😁 Emojis
Returns the top 100 shows and movies a user has favorited.`,
    path: '/:type/:sort_by/:sort_how',
    pathParams: typedSortedFavoritesParamsSchema,
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(sortQuerySchema)
      .merge(pageQuerySchema),
    responses: {
      200: favoritedItemResponseSchema.array(),
    },
  },
  byTypeSort: {
    summary: 'Get favorites',
    description:
      `#### 🔓 OAuth Optional 📄 Pagination Optional ✨ Extended Info 😁 Emojis
Returns the top 100 shows and movies a user has favorited, filtered by type and sorted by \`sort_by\` (default direction).`,
    path: '/:type/:sort_by',
    pathParams: favoritesByTypeSortParamsSchema,
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(sortQuerySchema)
      .merge(pageQuerySchema),
    responses: {
      200: favoritedItemResponseSchema.array(),
    },
  },
  byType: {
    summary: 'Get favorites',
    description:
      `#### 🔓 OAuth Optional 📄 Pagination Optional ✨ Extended Info 😁 Emojis
Returns the top 100 shows and movies a user has favorited, filtered by type.`,
    path: '/:type',
    pathParams: favoritesByTypeParamsSchema,
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(sortQuerySchema)
      .merge(pageQuerySchema),
    responses: {
      200: favoritedItemResponseSchema.array(),
    },
  },
  default: {
    summary: 'Get favorites',
    description:
      `#### 🔓 OAuth Optional 📄 Pagination Optional ✨ Extended Info 😁 Emojis
Returns the top 100 shows and movies a user has favorited.`,
    path: '',
    pathParams: profileParamsSchema,
    method: 'GET',
    query: extendedMediaQuerySchema
      .merge(sortQuerySchema)
      .merge(pageQuerySchema),
    responses: {
      200: favoritedItemResponseSchema.array(),
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

/** The favorite show response payload. */
export type FavoriteShowResponse = z.infer<typeof favoritedShowsResponseSchema>;
/** The favorite movie response payload. */
export type FavoriteMovieResponse = z.infer<
  typeof favoritedMoviesResponseSchema
>;
