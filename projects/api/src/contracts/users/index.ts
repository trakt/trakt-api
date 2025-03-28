import { builder } from '../_internal/builder.ts';
import { allPagesQuerySchema } from '../_internal/request/allPagesQuerySchema.ts';
import { bulkMediaRequestSchema } from '../_internal/request/bulkMediaRequestSchema.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { listRequestSchema } from '../_internal/request/listRequestSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { sortQuerySchema } from '../_internal/request/sortQuerySchema.ts';
import { listAddResponseSchema } from '../_internal/response/listAddResponseSchema.ts';
import { listedMovieResponseSchema } from '../_internal/response/listedMovieResponseSchema.ts';
import { listedShowResponseSchema } from '../_internal/response/listedShowResponseSchema.ts';
import { listRemoveResponseSchema } from '../_internal/response/listRemoveResponseSchema.ts';
import { listResponseSchema } from '../_internal/response/listResponseSchema.ts';
import type { sortDirectionSchema } from '../_internal/response/sortDirectionSchema.ts';
import { profileResponseSchema } from '../_internal/response/userProfileResponseSchema.ts';
import { z } from '../_internal/z.ts';
import { searchTypeParamFactory } from '../search/_internal/request/searchTypeParamFactory.ts';
import { dateRangeParamsSchema } from './_internal/request/dateRangeParamsSchema.ts';
import { hiddenParamsSchema } from './_internal/request/hiddenParamsSchema.ts';
import { hiddenShowRequestSchema } from './_internal/request/hiddenShowRequestSchema.ts';
import { historyItemIdParamsSchema } from './_internal/request/historyItemIdParamsSchema.ts';
import { likedTypeParamsSchema } from './_internal/request/likedTypeParamsSchema.ts';
import { listParamsSchema } from './_internal/request/listParamsSchema.ts';
import { profileParamsSchema } from './_internal/request/profileParamsSchema.ts';
import { socialActivityParamsSchema } from './_internal/request/socialActivityParamsSchema.ts';
import {
  type sortEnumSchema,
  sortParamsSchema,
} from './_internal/request/sortParamsSchema.ts';
import { activityHistoryResponseSchema } from './_internal/response/activityHistoryResponseSchema.ts';
import { episodeActivityHistoryResponseSchema } from './_internal/response/episodeActivityHistoryResponseSchema.ts';
import { favoritedMoviesResponseSchema } from './_internal/response/favoritedMoviesResponseSchema.ts';
import { favoritedShowsResponseSchema } from './_internal/response/favoritedShowsResponseSchema.ts';
import { hiddenAddResponseSchema } from './_internal/response/hiddenAddResponseSchema.ts';
import { hiddenRemoveResponseSchema } from './_internal/response/hiddenRemoveResponseSchema.ts';
import { hiddenShowResponseSchema } from './_internal/response/hiddenShowResponseSchema.ts';
import { likedItemResponseSchema } from './_internal/response/likedItemResponseSchema.ts';
import { movieActivityHistoryResponseSchema } from './_internal/response/movieActivityHistoryResponseSchema.ts';
import { RatedItemResponseSchema } from './_internal/response/ratedItemResponseSchema.ts';
import { settingsResponseSchema } from './_internal/response/settingsResponseSchema.ts';
import { showActivityHistoryResponseSchema } from './_internal/response/showActivityHistoryResponseSchema.ts';
import { socialActivityResponseSchema } from './_internal/response/socialActivityResponseSchema.ts';
import type { watchActionSchema } from './_internal/response/watchActionSchema.ts';
import { watchedMoviesResponseSchema } from './_internal/response/watchedMoviesResponseSchema.ts';
import { watchedShowsResponseSchema } from './_internal/response/watchedShowsResponseSchema.ts';

const watched = builder.router({
  movies: {
    path: '/movies',
    method: 'GET',
    pathParams: profileParamsSchema,
    responses: {
      200: watchedMoviesResponseSchema,
    },
  },
  shows: {
    path: '/shows',
    method: 'GET',
    query: extendedQuerySchemaFactory<['noseasons']>(),
    responses: {
      200: watchedShowsResponseSchema,
    },
  },
}, {
  pathPrefix: '/:id/watched',
});

const history = builder.router({
  all: {
    path: '/',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: activityHistoryResponseSchema.array(),
    },
  },
  movies: {
    path: '/movies',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: movieActivityHistoryResponseSchema.array(),
    },
  },
  shows: {
    path: '/shows',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: showActivityHistoryResponseSchema.array(),
    },
  },
  episodes: {
    path: '/episodes',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: episodeActivityHistoryResponseSchema.array(),
    },
  },
  movie: {
    path: '/movies/:item_id',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(historyItemIdParamsSchema),
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: movieActivityHistoryResponseSchema.array(),
    },
  },
  show: {
    path: '/shows/:item_id',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(historyItemIdParamsSchema),
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: showActivityHistoryResponseSchema.array(),
    },
  },
  episode: {
    path: '/episodes/:item_id',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(historyItemIdParamsSchema),
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(dateRangeParamsSchema)
      .merge(pageQuerySchema),
    responses: {
      200: episodeActivityHistoryResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/:id/history',
});

const watchlist = builder.router({
  movies: {
    path: '/movies/:sort',
    pathParams: profileParamsSchema.merge(sortParamsSchema),
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema),
    responses: {
      200: listedMovieResponseSchema.array(),
    },
  },
  shows: {
    path: '/shows/:sort',
    pathParams: profileParamsSchema.merge(sortParamsSchema),
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema),
    responses: {
      200: listedShowResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/:id/watchlist',
});

const ratings = builder.router({
  movies: {
    path: '/movies',
    pathParams: profileParamsSchema,
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: RatedItemResponseSchema.array(),
    },
  },
  shows: {
    path: '/shows',
    pathParams: profileParamsSchema,
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: RatedItemResponseSchema.array(),
    },
  },
  episodes: {
    path: '/episodes',
    pathParams: profileParamsSchema,
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: RatedItemResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/:id/ratings',
});

const favorites = builder.router({
  movies: {
    path: '/movies/:sort',
    pathParams: profileParamsSchema.merge(sortParamsSchema),
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: favoritedMoviesResponseSchema.array(),
    },
  },
  shows: {
    path: '/shows/:sort',
    pathParams: profileParamsSchema.merge(sortParamsSchema),
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: favoritedShowsResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/:id/favorites',
});

const list = builder.router({
  summary: {
    path: '/',
    method: 'GET',
    pathParams: profileParamsSchema.merge(listParamsSchema),
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: listResponseSchema,
    },
  },
  items: {
    path: '/items/:type',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(listParamsSchema)
      .merge(
        searchTypeParamFactory<
          ['movie', 'show']
        >(),
      ),
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema)
      .merge(sortQuerySchema),
    responses: {
      200: z.union([listedMovieResponseSchema, listedShowResponseSchema])
        .array(),
    },
  },
  add: {
    path: '/items',
    method: 'POST',
    body: listRequestSchema,
    responses: {
      201: listAddResponseSchema,
      420: z.undefined(),
    },
  },
  remove: {
    path: '/items/remove',
    method: 'POST',
    body: listRequestSchema,
    responses: {
      200: listRemoveResponseSchema,
    },
  },
}, {
  pathPrefix: '/:list_id',
});

const lists = builder.router({
  personal: {
    path: '',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: listResponseSchema.array(),
    },
  },
  collaborations: {
    path: '/collaborations',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: listResponseSchema.array(),
    },
  },
  list,
}, {
  pathPrefix: '/:id/lists',
});

const hidden = builder.router({
  add: {
    path: '/:section',
    pathParams: hiddenParamsSchema,
    method: 'POST',
    body: bulkMediaRequestSchema,
    responses: {
      200: hiddenAddResponseSchema,
    },
  },
  get: {
    path: '/progress_watched',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema)
      .merge(hiddenShowRequestSchema),
    responses: {
      200: hiddenShowResponseSchema.array(),
    },
  },
  remove: {
    progress: {
      path: '/progress_watched/remove',
      method: 'POST',
      body: bulkMediaRequestSchema,
      responses: {
        200: hiddenRemoveResponseSchema,
      },
    },
    calendar: {
      path: '/calendar/remove',
      method: 'POST',
      body: bulkMediaRequestSchema,
      responses: {
        200: hiddenRemoveResponseSchema,
      },
    },
  },
}, {
  pathPrefix: '/hidden',
});

export const users = builder.router({
  profile: {
    path: '/:id',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'vip']>(),
    responses: {
      200: profileResponseSchema,
    },
  },
  activities: {
    path: '/:id/:type/activities',
    method: 'GET',
    pathParams: profileParamsSchema.merge(socialActivityParamsSchema),
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema),
    responses: {
      200: socialActivityResponseSchema.array(),
    },
  },
  settings: {
    path: '/settings',
    method: 'GET',
    query: extendedQuerySchemaFactory<['browsing']>(),
    responses: {
      200: settingsResponseSchema,
    },
  },
  likes: {
    path: '/likes/:type',
    pathParams: likedTypeParamsSchema,
    method: 'GET',
    query: extendedQuerySchemaFactory<['comments', 'min', 'full', 'images']>()
      .and(pageQuerySchema.or(allPagesQuerySchema)),
    responses: {
      200: likedItemResponseSchema.array(),
    },
  },
  watched,
  history,
  watchlist,
  ratings,
  favorites,
  lists,
  hidden,
}, {
  pathPrefix: '/users',
});

export type ProfileParams = z.infer<typeof profileParamsSchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type SortDirection = z.infer<typeof sortDirectionSchema>;
export type WatchAction = z.infer<typeof watchActionSchema>;
export type SortType = z.infer<typeof sortEnumSchema>;

export type SettingsResponse = z.infer<typeof settingsResponseSchema>;

export type WatchedMoviesResponse = z.infer<typeof watchedMoviesResponseSchema>;
export type WatchedShowsResponse = z.infer<typeof watchedShowsResponseSchema>;

export type MovieActivityHistoryResponse = z.infer<
  typeof movieActivityHistoryResponseSchema
>;
export type ShowActivityHistoryResponse = z.infer<
  typeof showActivityHistoryResponseSchema
>;
export type ActivityHistoryResponse = z.infer<
  typeof activityHistoryResponseSchema
>;
export type EpisodeActivityHistoryResponse = z.infer<
  typeof episodeActivityHistoryResponseSchema
>;

export type ListedMovieResponse = z.infer<
  typeof listedMovieResponseSchema
>;
export type ListedShowResponse = z.infer<
  typeof listedShowResponseSchema
>;

export type RatedItemResponse = z.infer<typeof RatedItemResponseSchema>;

export type SocialActivityResponse = z.infer<
  typeof socialActivityResponseSchema
>;

export type HiddenShowItemResponse = z.infer<
  typeof hiddenShowResponseSchema
>;

export type HiddenMediaRequest = z.infer<typeof bulkMediaRequestSchema>;

export type LikedItemResponse = z.infer<typeof likedItemResponseSchema>;

export type ListRequest = z.infer<typeof listRequestSchema>;
export type ListAddResponse = z.infer<typeof listAddResponseSchema>;
export type ListRemoveResponse = z.infer<
  typeof listRemoveResponseSchema
>;
