import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { extendedProfileQuerySchema } from '../_internal/request/extendedProfileQuerySchema.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { limitlessQuerySchema } from '../_internal/request/limitlessQuerySchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { profileResponseSchema } from '../_internal/response/profileResponseSchema.ts';
import type { sortDirectionSchema } from '../_internal/response/sortDirectionSchema.ts';
import { z } from '../_internal/z.ts';
import { avatarRequestSchema } from './schema/request/avatarRequestSchema.ts';
import { commentOnTypeParamsSchema } from './schema/request/commentOnTypeParamsSchema.ts';
import { commentsRequestSchema } from './schema/request/commentsRequestSchema.ts';
import { commentTypeParamsSchema } from './schema/request/commentTypeParamsSchema.ts';
import { coverRequestSchema } from './schema/request/coverRequestSchema.ts';
import { monthInReviewParamsSchema } from './schema/request/monthInReviewParamsSchema.ts';
import { profileParamsSchema } from './schema/request/profileParamsSchema.ts';
import { settingsRequestSchema } from './schema/request/settingsRequestSchema.ts';
import { socialActivityParamsSchema } from './schema/request/socialActivityParamsSchema.ts';
import { sortEnumSchema } from './schema/request/sortParamsSchema.ts';
import { followerResponseSchema } from './schema/response/followerResponseSchema.ts';
import { followResponseSchema } from './schema/response/followResponseSchema.ts';
import { friendResponseSchema } from './schema/response/friendResponseSchema.ts';
import {
  likedCommentResponseSchema,
  likedListResponseSchema,
} from './schema/response/likedItemResponseSchema.ts';
import { monthInReviewResponseSchema } from './schema/response/monthInReviewResponseSchema.ts';
import { reactedCommentResponseSchema } from './schema/response/reactedCommentResponseSchema.ts';
import { settingsResponseSchema } from './schema/response/settingsResponseSchema.ts';
import { socialActivityResponseSchema } from './schema/response/socialActivityResponseSchema.ts';
import { userCommentResponseSchema } from './schema/response/userCommentResponseSchema.ts';
import { userStatsResponseSchema } from './schema/response/userStatsResponseSchema.ts';
import { watchActionSchema } from './schema/response/watchActionSchema.ts';
import { watchingResponseSchema } from './schema/response/watchingResponseSchema.ts';
import { favorites } from './subroutes/favorites.ts';
import { filters } from './subroutes/filters.ts';
import { hidden } from './subroutes/hidden.ts';
import { history } from './subroutes/history.ts';
import { ratings } from './subroutes/ratings.ts';
import { requests } from './subroutes/requests.ts';
import { userLists } from './subroutes/userLists.ts';
import { watched } from './subroutes/watched.ts';
import { watchlist } from './subroutes/watchlist.ts';

const GLOBAL_LEVEL = builder.router({
  settings: {
    path: '/settings',
    method: 'GET',
    query: extendedQuerySchemaFactory<['browsing']>(),
    responses: {
      200: settingsResponseSchema,
    },
  },
  reactions: {
    comments: {
      path: '/reactions/comments',
      method: 'GET',
      query: extendedQuerySchemaFactory<['comments', 'min', 'full', 'images']>()
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: reactedCommentResponseSchema.array(),
      },
    },
  },
  likes: {
    comments: {
      path: '/likes/comments',
      method: 'GET',
      query: extendedQuerySchemaFactory<['comments', 'min', 'full', 'images']>()
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: likedCommentResponseSchema.array(),
      },
    },
    lists: {
      path: '/likes/lists',
      method: 'GET',
      query: extendedQuerySchemaFactory<['comments', 'min', 'full', 'images']>()
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: likedListResponseSchema.array(),
      },
    },
  },
  avatar: {
    path: '/avatar',
    method: 'PUT',
    body: avatarRequestSchema,
    responses: {
      204: z.undefined(),
      400: z.undefined(),
    },
  },
  cover: {
    path: '/set_cover',
    method: 'PUT',
    body: coverRequestSchema,
    responses: {
      204: z.undefined(),
      400: z.undefined(),
    },
  },
  saveSettings: {
    path: '/settings',
    method: 'PUT',
    body: settingsRequestSchema,
    responses: {
      201: z.undefined(),
    },
  },
});

const ENTITY_LEVEL = builder.router({
  profile: {
    path: '/',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'vip']>(),
    responses: {
      200: profileResponseSchema,
    },
  },
  activities: {
    path: '/:type/activities',
    method: 'GET',
    pathParams: profileParamsSchema.merge(socialActivityParamsSchema),
    query: extendedMediaQuerySchema
      .merge(pageQuerySchema),
    responses: {
      200: socialActivityResponseSchema.array(),
    },
  },
  stats: {
    path: '/stats',
    pathParams: profileParamsSchema,
    method: 'GET',
    responses: {
      200: userStatsResponseSchema,
    },
  },
  comments: {
    path: '/comments/:comment_type/:type',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(commentTypeParamsSchema)
      .merge(commentOnTypeParamsSchema),
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema)
      .merge(commentsRequestSchema),
    responses: {
      200: userCommentResponseSchema.array(),
    },
  },
  watching: {
    path: '/watching',
    pathParams: profileParamsSchema,
    method: 'GET',
    query: extendedMediaQuerySchema,
    responses: {
      200: watchingResponseSchema,
      204: z.undefined(),
    },
  },
  follow: {
    path: '/follow',
    method: 'POST',
    pathParams: profileParamsSchema,
    body: z.undefined(),
    responses: {
      201: followResponseSchema,
      409: z.undefined(),
    },
  },
  unfollow: {
    path: '/follow',
    method: 'DELETE',
    pathParams: profileParamsSchema,
    responses: {
      204: z.undefined(),
    },
  },
  followers: {
    path: '/followers',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedProfileQuerySchema,
    responses: {
      200: followerResponseSchema.array(),
    },
  },
  following: {
    path: '/following',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedProfileQuerySchema,
    responses: {
      200: followerResponseSchema.array(),
    },
  },
  friends: {
    path: '/friends',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedProfileQuerySchema,
    responses: {
      200: friendResponseSchema.array(),
    },
  },
  month_in_review: {
    path: '/mir/:year/:month',
    pathParams: profileParamsSchema
      .merge(monthInReviewParamsSchema),
    query: extendedMediaQuerySchema,
    method: 'GET',
    responses: {
      200: monthInReviewResponseSchema,
    },
  },
}, {
  pathPrefix: '/:id',
});

export const users = builder.router({
  ...GLOBAL_LEVEL,
  ...ENTITY_LEVEL,
  watched,
  history,
  watchlist,
  ratings,
  favorites,
  lists: userLists,
  hidden,
  requests,
  filters,
}, {
  pathPrefix: '/users',
});

export type * from './subroutes/favorites.ts';
export type * from './subroutes/filters.ts';
export type * from './subroutes/hidden.ts';
export type * from './subroutes/history.ts';
export type * from './subroutes/ratings.ts';
export type * from './subroutes/requests.ts';
export type * from './subroutes/userLists.ts';
export type * from './subroutes/watched.ts';
export type * from './subroutes/watchlist.ts';

export {
  avatarRequestSchema,
  commentOnTypeParamsSchema,
  commentsRequestSchema,
  commentTypeParamsSchema,
  coverRequestSchema,
  followerResponseSchema,
  followResponseSchema,
  friendResponseSchema,
  likedCommentResponseSchema,
  likedListResponseSchema,
  monthInReviewParamsSchema,
  monthInReviewResponseSchema,
  profileParamsSchema,
  reactedCommentResponseSchema,
  settingsRequestSchema,
  settingsResponseSchema,
  socialActivityResponseSchema,
  sortEnumSchema,
  userCommentResponseSchema,
  userStatsResponseSchema,
  watchActionSchema,
  watchingResponseSchema,
};

export type ProfileParams = z.infer<typeof profileParamsSchema>;
export type SettingsResponse = z.infer<typeof settingsResponseSchema>;

export type SortDirection = z.infer<typeof sortDirectionSchema>;
export type SortType = z.infer<typeof sortEnumSchema>;

export type WatchAction = z.infer<typeof watchActionSchema>;

export type LikedCommentItemResponse = z.infer<
  typeof likedCommentResponseSchema
>;
export type LikedListItemResponse = z.infer<typeof likedListResponseSchema>;

export type SocialActivityResponse = z.infer<
  typeof socialActivityResponseSchema
>;
export type FollowerResponse = z.infer<
  typeof followerResponseSchema
>;
export type FollowResponse = z.infer<typeof followResponseSchema>;
export type FriendResponse = z.infer<typeof friendResponseSchema>;

export type UserStatsResponse = z.infer<typeof userStatsResponseSchema>;

export type CommentTypeParams = z.infer<typeof commentTypeParamsSchema>;
export type CommentOnTypeParams = z.infer<typeof commentOnTypeParamsSchema>;
export type CommentRequest = z.infer<typeof commentsRequestSchema>;
export type UserCommentResponse = z.infer<typeof userCommentResponseSchema>;

export type WatchingResponse = z.infer<typeof watchingResponseSchema>;
export type AvatarRequest = z.infer<typeof avatarRequestSchema>;
export type CoverRequest = z.infer<typeof coverRequestSchema>;
export type SettingsRequest = z.infer<typeof settingsRequestSchema>;

export type MonthInReviewParams = z.infer<typeof monthInReviewParamsSchema>;
export type MonthInReviewResponse = z.infer<typeof monthInReviewResponseSchema>;

export type ReactedCommentResponse = z.infer<
  typeof reactedCommentResponseSchema
>;
