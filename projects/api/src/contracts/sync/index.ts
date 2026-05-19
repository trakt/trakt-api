import { authMetadata, builder } from '../_internal/builder.ts';
import { bulkMediaRequestSchema } from '../_internal/request/bulkMediaRequestSchema.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { lifetimeStatsQuerySchema } from '../_internal/request/lifetimeStatsQuerySchema.ts';
import { listRequestSchema } from '../_internal/request/listRequestSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { sortQuerySchema } from '../_internal/request/sortQuerySchema.ts';
import { statsQuerySchema } from '../_internal/request/statsQuerySchema.ts';
import { listAddResponseSchema } from '../_internal/response/listAddResponseSchema.ts';
import { listRemoveResponseSchema } from '../_internal/response/listRemoveResponseSchema.ts';
import { z } from '../_internal/z.ts';
import { collectionParamSchema } from './schema/request/collectionParamSchema.ts';
import { favoriteParamSchema } from './schema/request/favoritesParamSchema.ts';
import { historyRemoveRequestSchema } from './schema/request/historyRemoveRequestSchema.ts';
import { minimalParamSchema } from './schema/request/minimalParamSchema.ts';
import { playbackIdParamsSchema } from './schema/request/playbackIdParamsSchema.ts';
import { progressParamsSchema } from './schema/request/progressParamsSchema.ts';
import { ratingsParamSchema } from './schema/request/ratingsParamSchema.ts';
import { removeRatingsParamSchema } from './schema/request/removeRatingsParamSchema.ts';
import { upNextIntentQuerySchema } from './schema/request/upNextIntentQuerySchema.ts';
import {
  collectionMinimalResponseSchema,
  collectionMinimalShowResponseSchema,
} from './schema/response/collectionMinimalResponseSchema.ts';
import {
  collectedEpisodeSchema,
  collectedMovieSchema,
  collectedShowSchema,
  collectionResponseSchema,
} from './schema/response/collectionResponseSchema.ts';
import { favoritesRemoveResponseSchema } from './schema/response/favoritesRemoveResponseSchema.ts';
import { favoritesResponseSchema } from './schema/response/favoritesResponseSchema.ts';
import { historyRemoveResponseSchema } from './schema/response/historyRemoveResponseSchema.ts';
import { historyResponseSchema } from './schema/response/historyResponseSchema.ts';
import { movieProgressResponseSchema } from './schema/response/movieProgressResponseSchema.ts';
import { ratingsSyncResponseSchema } from './schema/response/ratingsResponseSchema.ts';
import { removeRatingsResponseSchema } from './schema/response/removeRatingsResponseSchema.ts';
import { upNextResponseSchema } from './schema/response/upNextResponseSchema.ts';

const progress = builder.router({
  upNext: {
    standard: {
      summary: 'Get up next',
      description: `#### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
Returns the authenticated user up next progress ordered by the requested sort. Use \`include_stats\` and \`lifetime_stats\` to include additional watch stats.`,
      method: 'GET',
      path: '/progress/up_next',
      query: extendedQuerySchemaFactory<['full', 'images']>()
        .merge(pageQuerySchema)
        .merge(sortQuerySchema)
        .merge(statsQuerySchema)
        .merge(lifetimeStatsQuerySchema),
      responses: {
        200: upNextResponseSchema.array(),
      },
    },
    nitro: {
      summary: 'Get up next nitro',
      description: `#### 🔒 OAuth Required 📄 Pagination
Returns the authenticated user up next progress optimized for intent-based clients. Use \`intent\` plus sorting and pagination to control the response.`,
      method: 'GET',
      path: '/progress/up_next_nitro',
      query: pageQuerySchema
        .merge(sortQuerySchema)
        .merge(upNextIntentQuerySchema),
      responses: {
        200: upNextResponseSchema.array(),
      },
    },
  },
  movies: {
    summary: 'Get movie playback progress',
    description: `#### 🔒 OAuth Required 📄 Pagination Optional ✨ Extended Info
Returns in-progress movie playback items for the authenticated user. Use \`start_at\` and \`end_at\` to filter progress updated within a UTC datetime range.`,
    method: 'GET',
    path: '/playback/movies',
    query: extendedQuerySchemaFactory<['full', 'images', 'available_on']>()
      .merge(pageQuerySchema)
      .merge(progressParamsSchema),
    responses: {
      200: movieProgressResponseSchema.array(),
    },
  },
  drop: {
    movie: {
      summary: 'Remove a playback item',
      description: `#### 🔒 OAuth Required
Remove a playback item from a user's playback progress list. A \`404\` will be returned if the \`id\` is invalid.`,
      path: '/playback/:id',
      method: 'DELETE',
      pathParams: playbackIdParamsSchema,
      responses: {
        204: z.undefined(),
      },
    },
  },
  watched: {
    summary: 'Get watched progress',
    description:
      '#### 🔒 OAuth Required 📄 Pagination ✨ Extended Info\nReturns watched progress for the authenticated user. Use hide filters to include or exclude completed, incomplete, or currently rewatching shows.',
    method: 'GET',
    path: '/progress/watched',
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema)
      .merge(sortQuerySchema)
      .merge(lifetimeStatsQuerySchema)
      .merge(z.object({
        hide_completed: z.boolean().optional(),
        hide_not_completed: z.boolean().optional(),
        only_rewatching: z.boolean().optional().openapi({
          description:
            'When true, restrict the list to shows the user is currently rewatching (i.e. those with an active `progress.reset_at`).',
        }),
      })),
    responses: {
      200: upNextResponseSchema.array(),
    },
  },
});

const history = builder.router({
  add: {
    summary: 'Add items to watched history',
    description: `#### 🔒 OAuth Required
Add items to a user's watch history. Accepts shows, seasons, episodes and movies. If only a show is passed, all episodes for the show will be added. If seasons are specified, only episodes in those seasons will be added.

Send a \`watched_at\` UTC datetime to mark items as watched in the past. This is useful for syncing past watches from a media center.

> ### IMPORTANT
> _Please be careful with sending duplicate data. We don't verify the \`item\` + \`watched_at\` to ensure it's unique, it is up to your app to veify this and not send duplicate plays._

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`movies\` | array | Array of \`movie\` objects. (see examples ->) |
| \`shows\` | array | Array of \`show\` objects. |
| \`seasons\` | array | Array of \`season\` objects. |
| \`episodes\` | array | Array of \`episode\` objects. |

#### Media Object POST Data
| Key | Type | Value |
|---|---|---|
| item * | object | \`movie\`, \`show\`, or \`episode\` object. |
| \`watched_at\` | datetime | UTC datetime when the item was watched. Set to \`released\` to automatically use the initial release date + runtime *(episodes only)*. Set to \`unknown\` to mark the item as watched without a specific date. |`,
    method: 'POST',
    path: '',
    body: bulkMediaRequestSchema,
    responses: {
      200: historyResponseSchema,
    },
  },
  remove: {
    summary: 'Remove items from history',
    description: `#### 🔒 OAuth Required
Remove items from a user's watch history including all watches, scrobbles, and checkins. Accepts shows, seasons, episodes and movies. If only a show is passed, all episodes for the show will be removed. If seasons are specified, only episodes in those seasons will be removed.

You can also send a list of raw history \`ids\` _(64-bit integers)_ to delete single plays from the watched history. The [**/sync/history**](#reference/sync/get-history) method will return an individual \`id\` _(64-bit integer)_ for each history item.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`movies\` | array | Array of \`movie\` objects. (see examples ->) |
| \`shows\` | array | Array of \`show\` objects. |
| \`seasons\` | array | Array of \`season\` objects. |
| \`episodes\` | array | Array of \`episode\` objects. |
| \`ids\` | array | Array of history ids. |`,
    method: 'POST',
    path: '/remove',
    body: historyRemoveRequestSchema,
    responses: {
      200: historyRemoveResponseSchema,
    },
  },
}, {
  pathPrefix: '/history',
});

const watchlist = builder.router({
  add: {
    summary: 'Add items to watchlist',
    description: `#### 🔥 VIP Enhanced 🔒 OAuth Required 😁 Emojis
Add one of more items to a user's watchlist. Accepts shows, seasons, episodes and movies. If only a show is passed, only the show itself will be added. If seasons are specified, all of those seasons will be added.

#### Notes

Each watchlist item can optionally accept a \`notes\` *(500 maximum characters)* field with custom text. The user must be a [**Trakt VIP**](https://trakt.tv/vip) to send \`notes\`.

#### Limits

If the user's watchlist limit is exceeded, a \`420\` HTTP error code is returned. Use the [**/users/settings**](/reference/users/settings) method to get all limits for a user account. In most cases, upgrading to [**Trakt VIP**](https://trakt.tv/vip) will increase the limits.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`movies\` | array | Array of \`movie\` objects. (see examples ->) |
| \`shows\` | array | Array of \`show\` objects. |
| \`seasons\` | array | Array of \`season\` objects. |
| \`episodes\` | array | Array of \`episode\` objects. |`,
    method: 'POST',
    path: '',
    body: listRequestSchema,
    responses: {
      201: listAddResponseSchema,
    },
  },
  remove: {
    summary: 'Remove items from watchlist',
    description: `#### 🔒 OAuth Required
Remove one or more items from a user's watchlist.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`movies\` | array | Array of \`movie\` objects. (see examples ->) |
| \`shows\` | array | Array of \`show\` objects. |
| \`seasons\` | array | Array of \`season\` objects. |
| \`episodes\` | array | Array of \`episode\` objects. |`,
    method: 'POST',
    path: '/remove',
    body: listRequestSchema,
    responses: {
      200: listRemoveResponseSchema,
    },
  },
}, {
  pathPrefix: '/watchlist',
});

const ratings = builder.router({
  add: {
    summary: 'Add new ratings',
    description: `#### 🔒 OAuth Required
Rate one or more items. Accepts shows, seasons, episodes and movies. If only a show is passed, only the show itself will be rated. If seasons are specified, all of those seasons will be rated.

Send a \`rated_at\` UTC datetime to mark items as rated in the past. This is useful for syncing ratings from a media center.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`movies\` | array | Array of \`movie\` objects. (see examples ->) |
| \`shows\` | array | Array of \`show\` objects. |
| \`seasons\` | array | Array of \`season\` objects. |
| \`episodes\` | array | Array of \`episode\` objects. |

#### Media Object POST Data
| Key | Type | Value |
|---|---|---|
| item * | object | \`movie\`, \`show\`, \`season\`, or \`episode\` object. |
| \`rating\` * | integer | Between 1 and 10. |
| \`rated_at\` | datetime | UTC datetime when the item was rated. |`,
    method: 'POST',
    path: '',
    body: ratingsParamSchema,
    responses: {
      201: ratingsSyncResponseSchema,
    },
  },
  remove: {
    summary: 'Remove ratings',
    description: `#### 🔒 OAuth Required
Remove ratings for one or more items.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`movies\` | array | Array of \`movie\` objects. (see examples ->) |
| \`shows\` | array | Array of \`show\` objects. |
| \`seasons\` | array | Array of \`season\` objects. |
| \`episodes\` | array | Array of \`episode\` objects. |`,
    method: 'POST',
    path: '/remove',
    body: removeRatingsParamSchema,
    responses: {
      200: removeRatingsResponseSchema,
    },
  },
}, {
  pathPrefix: '/ratings',
});

const favorites = builder.router({
  add: {
    summary: 'Add items to favorites',
    description: `#### 🔒 OAuth Required 😁 Emojis
If the user only had 50 TV shows and movies to bring with them on a deserted island, what would they be? Apps should encourage user's to add favorites so the algorithm keeps getting better.

#### Notes

Each favorite can optionally accept a \`notes\` *(500 maximum characters)* field explaining why the user favorited the item.

#### Limits

If the user's favorite limit is exceeded, a \`420\` HTTP error code is returned. This limit applies to all users.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`movies\` | array | Array of \`movie\` objects. (see examples ->) |
| \`shows\` | array | Array of \`show\` objects. |`,
    method: 'POST',
    path: '',
    body: favoriteParamSchema,
    responses: {
      201: favoritesResponseSchema,
    },
  },
  remove: {
    summary: 'Remove items from favorites',
    description: `#### 🔒 OAuth Required
Remove items from a user's favorites. Apps should encourage user's to add favorites so the algorithm keeps getting better.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`movies\` | array | Array of \`movie\` objects. (see examples ->) |
| \`shows\` | array | Array of \`show\` objects. |`,
    method: 'POST',
    path: '/remove',
    body: favoriteParamSchema,
    responses: {
      200: favoritesRemoveResponseSchema,
    },
  },
}, {
  pathPrefix: '/favorites',
});

const collection = builder.router({
  movies: {
    summary: 'Get movie collection',
    description: `#### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
Returns movies in the authenticated user collection. Use \`available_on\` and pagination to filter and move through collected movies.`,
    method: 'GET',
    path: '/movies',
    query: extendedQuerySchemaFactory<['full', 'images', 'available_on']>()
      .merge(collectionParamSchema)
      .merge(pageQuerySchema),
    responses: {
      200: collectedMovieSchema.array(),
    },
  },
  shows: {
    summary: 'Get show collection',
    description: `#### 🔒 OAuth Required ✨ Extended Info
Returns shows in the authenticated user collection, including collected seasons and episodes.`,
    method: 'GET',
    path: '/shows',
    query: extendedQuerySchemaFactory<['full', 'images', 'available_on']>()
      .merge(collectionParamSchema),
    responses: {
      200: collectedShowSchema.array(),
    },
  },
  episodes: {
    summary: 'Get episode collection',
    description: `#### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
Returns episodes in the authenticated user collection. Use \`available_on\` and pagination to filter and move through collected episodes.`,
    method: 'GET',
    path: '/episodes',
    query: extendedQuerySchemaFactory<['full', 'images', 'available_on']>()
      .merge(collectionParamSchema)
      .merge(pageQuerySchema),
    responses: {
      200: collectedEpisodeSchema.array(),
    },
  },
  media: {
    summary: 'Get media collection',
    description: `#### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
Returns movies, shows, and episodes in the authenticated user collection. Use \`available_on\` and pagination to filter and move through collected media.`,
    method: 'GET',
    path: '/media',
    query: extendedQuerySchemaFactory<['full', 'images', 'available_on']>()
      .merge(collectionParamSchema)
      .merge(pageQuerySchema),
    responses: {
      200: collectionResponseSchema.array(),
    },
  },
  minimal: builder.router({
    movies: {
      summary: 'Get minimal movie collection',
      description: `#### 🔒 OAuth Required
Returns the authenticated user movie collection in a minimal format optimized for syncing local state.`,
      method: 'GET',
      path: '/movies',
      query: collectionParamSchema,
      responses: {
        200: collectionMinimalResponseSchema,
      },
    },
    shows: {
      summary: 'Get minimal show collection',
      description: `#### 🔒 OAuth Required
Returns the authenticated user show collection in a minimal format optimized for syncing local state.`,
      method: 'GET',
      path: '/shows',
      query: collectionParamSchema,
      responses: {
        200: collectionMinimalShowResponseSchema,
      },
    },
    episodes: {
      summary: 'Get minimal episode collection',
      description: `#### 🔒 OAuth Required
Returns the authenticated user episode collection in a minimal format optimized for syncing local state.`,
      method: 'GET',
      path: '/episodes',
      query: collectionParamSchema,
      responses: {
        200: collectionMinimalResponseSchema,
      },
    },
  }, { pathPrefix: '/minimal' }),
}, {
  pathPrefix: '/collection',
});

export const sync = builder.router({
  history,
  progress,
  watchlist,
  ratings,
  favorites,
  collection,
}, {
  pathPrefix: '/sync',
  metadata: authMetadata('required'),
});

export {
  collectionMinimalResponseSchema,
  collectionMinimalShowResponseSchema,
  collectionParamSchema,
  collectionResponseSchema,
  favoriteParamSchema,
  favoritesRemoveResponseSchema,
  favoritesResponseSchema,
  historyRemoveRequestSchema,
  historyResponseSchema,
  minimalParamSchema,
  movieProgressResponseSchema,
  ratingsParamSchema,
  ratingsSyncResponseSchema,
  removeRatingsParamSchema,
  upNextIntentQuerySchema,
  upNextResponseSchema,
};

export type UpNextResponse = z.infer<typeof upNextResponseSchema>;
export type MovieProgressResponse = z.infer<typeof movieProgressResponseSchema>;
export type UpNextIntentRequest = z.infer<typeof upNextIntentQuerySchema>;

export type HistoryAddRequest = z.infer<typeof bulkMediaRequestSchema>;
export type HistoryRemoveRequest = z.infer<typeof historyRemoveRequestSchema>;
export type HistoryResponse = z.infer<typeof historyResponseSchema>;
export type HistoryRemoveResponse = z.infer<typeof historyRemoveResponseSchema>;

export type WatchlistRequest = z.infer<typeof listRequestSchema>;

export type RatingsSyncRequest = z.infer<typeof ratingsParamSchema>;
export type RatingsSyncResponse = z.infer<typeof ratingsSyncResponseSchema>;

export type FavoritesRequest = z.infer<typeof favoriteParamSchema>;
export type FavoritesResponse = z.infer<typeof favoritesResponseSchema>;
export type FavoritesRemoveResponse = z.infer<
  typeof favoritesRemoveResponseSchema
>;

export type CollectionRequest = z.infer<typeof collectionParamSchema>;
export type CollectionResponse = z.infer<typeof collectionResponseSchema>;
export type CollectionMovieResponse = z.infer<typeof collectedMovieSchema>;
export type CollectionShowResponse = z.infer<typeof collectedShowSchema>;
export type CollectionEpisodeResponse = z.infer<typeof collectedEpisodeSchema>;
export type CollectionMinimalResponse = z.infer<
  typeof collectionMinimalResponseSchema
>;
export type CollectionMinimalShowResponse = z.infer<
  typeof collectionMinimalShowResponseSchema
>;

export type RemoveRatingsParams = z.infer<typeof removeRatingsParamSchema>;
