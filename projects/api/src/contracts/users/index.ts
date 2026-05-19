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
import { userReportRequestSchema } from './schema/request/userReportRequestSchema.ts';
import { yearInReviewParamsSchema } from './schema/request/yearInReviewParamsSchema.ts';
import { blockedUserResponseSchema } from './schema/response/blockedUserResponseSchema.ts';
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
import { yearInReviewResponseSchema } from './schema/response/yearInReviewResponseSchema.ts';
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
    summary: 'Retrieve settings',
    description: `#### 🔒 OAuth Required
Get the user's settings so you can align your app's experience with what they're used to on the trakt website. A globally unique \`uuid\` is also returned, which can be used to identify the user locally in your app if needed. However, the \`uuid\` can't be used to retrieve data from the Trakt API.

#### Limits

The \`limits\` object is useful to customize your user experience. For example, if the user has a \`list\` limit of \`2\`, you might want to show a message to the user that they need to upgrade to [**Trakt VIP**](https://trakt.tv/vip) to add more lists.

#### Permissions

The \`permissions\` object is also useful to customize your user experience. In general, an account will have permissions to do everything. However, we'll temporarily set a permission to \`false\` if the user triggers spam protections.`,
    path: '/settings',
    method: 'GET',
    query: extendedQuerySchemaFactory<['browsing']>(),
    responses: {
      200: settingsResponseSchema,
    },
  },
  reactions: {
    comments: {
      summary: 'Get comment reactions',
      description: `#### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
Returns comments the authenticated user has reacted to. Use \`extended\`, \`page\`, and \`limit\` to control returned comment detail and pagination.`,
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
      summary: 'Get liked comments',
      description: `#### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
Returns comments the authenticated user has liked. Use \`extended\`, \`page\`, and \`limit\` to control returned comment detail and pagination.`,
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
      summary: 'Get liked lists',
      description: `#### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
Returns lists the authenticated user has liked. Use \`extended\`, \`page\`, and \`limit\` to control returned list detail and pagination.`,
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
    summary: 'Update avatar',
    description: `#### 🔒 OAuth Required
Update the authenticated user avatar. Send the avatar request body; a successful update returns a \`204\` response, and invalid image data returns \`400\`.`,
    path: '/avatar',
    method: 'PUT',
    body: avatarRequestSchema,
    responses: {
      204: z.undefined(),
      400: z.undefined(),
    },
  },
  cover: {
    summary: 'Update cover image',
    description: `#### 🔒 OAuth Required
Update the authenticated user cover image. Send the cover request body; a successful update returns a \`204\` response, and invalid image data returns \`400\`.`,
    path: '/set_cover',
    method: 'PUT',
    body: coverRequestSchema,
    responses: {
      204: z.undefined(),
      400: z.undefined(),
    },
  },
  saveSettings: {
    summary: 'Update settings',
    description: `#### 🔒 OAuth Required
Update settings for the authenticated user. Send the settings request body with the values to change; a successful update returns no response body.`,
    path: '/settings',
    method: 'PUT',
    body: settingsRequestSchema,
    responses: {
      201: z.undefined(),
    },
  },
  blocked: {
    summary: 'Get blocked users',
    description: `#### 🔒 OAuth Required
Returns all users you have blocked, including when each user was blocked.`,
    path: '/blocked',
    method: 'GET',
    responses: {
      200: blockedUserResponseSchema.array(),
    },
  },
});

const ENTITY_LEVEL = builder.router({
  profile: {
    summary: 'Get user profile',
    description: `#### 🔓 OAuth Optional ✨ Extended Info
Get a user's profile information. If the user is private, info will only be returned if you send OAuth and are either that user or an approved follower. Adding \`?extended=vip\` will return some additional VIP related fields so you can display the user's Trakt VIP status and year count.`,
    path: '/',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'vip']>(),
    responses: {
      200: profileResponseSchema,
    },
  },
  activities: {
    summary: 'Get social activity',
    description: `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
Returns recent activity for a user social graph. Use \`type\` to choose \`friends\`, \`followers\`, or \`following\`, and use pagination to move through the activity feed.`,
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
    summary: 'Get stats',
    description: `#### 🔓 OAuth Optional
Returns stats about the movies, shows, and episodes a user has watched, collected, and rated.`,
    path: '/stats',
    pathParams: profileParamsSchema,
    method: 'GET',
    responses: {
      200: userStatsResponseSchema,
    },
  },
  comments: {
    summary: 'Get comments',
    description: `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
Returns the most recently written comments for the user. You can optionally filter by the \`comment_type\` and media \`type\` to limit what gets returned.

By default, only top level comments are returned. Set \`?include_replies=true\` to return replies in addition to top level comments. Set \`?include_replies=only\` to return only replies and no top level comments.`,
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
    summary: 'Get watching',
    description: `#### 🔓 OAuth Optional ✨ Extended Info
Returns a movie or episode if the user is currently watching something.  If they are not, it returns no data and a \`204\` HTTP status code.`,
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
    summary: 'Follow this user',
    description: `#### 🔒 OAuth Required
If the user has a private profile, the follow request will require approval (\`approved_at\` will be null). If a user is public, they will be followed immediately (\`approved_at\` will have a date).

> ### Note
> _If this user is already being followed or there is a pending follow request, a \`409\` HTTP status code will returned._`,
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
    summary: 'Unfollow this user',
    description: `#### 🔒 OAuth Required
Unfollow someone you already follow.`,
    path: '/follow',
    method: 'DELETE',
    pathParams: profileParamsSchema,
    responses: {
      204: z.undefined(),
    },
  },
  block: {
    summary: 'Block this user',
    description: `#### 🔒 OAuth Required
Block a user. If they are already following you, they will be removed from your followers. Any pending follow request from this user will be blocked, preventing them from following you in the future until you unblock them.

> ### Note
> _If the user is already blocked, or you try to block yourself, a \`409\` HTTP status code will be returned._`,
    path: '/block',
    method: 'POST',
    pathParams: profileParamsSchema,
    body: z.undefined(),
    responses: {
      201: z.undefined(),
      409: z.undefined(),
    },
  },
  unblock: {
    summary: 'Unblock this user',
    description: `#### 🔒 OAuth Required
Unblock a user you previously blocked.`,
    path: '/block',
    method: 'DELETE',
    pathParams: profileParamsSchema,
    responses: {
      204: z.undefined(),
    },
  },
  report: {
    summary: 'Report a user',
    description: `#### 🔒 OAuth Required
Report a user for moderator review. Send a \`reason\` and optional \`message\` with additional context. A user can only have one \`pending\` report per reported user.

| reason | description |
|---|---|
| \`spam\` | Spam account |
| \`adult\` | Adult content in profile |
| \`language\` | Not using English |
| \`other\` | Anything else (add details in \`message\`) |`,
    path: '/report',
    method: 'POST',
    pathParams: profileParamsSchema,
    body: userReportRequestSchema,
    responses: {
      201: z.undefined(),
      400: z.undefined(),
      409: z.undefined(),
    },
  },
  followers: {
    summary: 'Get followers',
    description: `#### 🔓 OAuth Optional ✨ Extended Info
Returns all followers including when the relationship began.`,
    path: '/followers',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedProfileQuerySchema,
    responses: {
      200: followerResponseSchema.array(),
    },
  },
  following: {
    summary: 'Get following',
    description: `#### 🔓 OAuth Optional ✨ Extended Info
Returns all user's they follow including when the relationship began.`,
    path: '/following',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedProfileQuerySchema,
    responses: {
      200: followerResponseSchema.array(),
    },
  },
  friends: {
    summary: 'Get friends',
    description: `#### 🔓 OAuth Optional ✨ Extended Info
Returns all friends for a user including when the relationship began. Friendship is a 2 way relationship where each user follows the other.`,
    path: '/friends',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedProfileQuerySchema,
    responses: {
      200: friendResponseSchema.array(),
    },
  },
  month_in_review: {
    summary: 'Get month in review',
    description: `#### 🔓 OAuth Optional ✨ Extended Info
Returns a month-in-review summary for a user. Send the \`year\` and \`month\` path parameters to choose the review period.`,
    path: '/mir/:year/:month',
    pathParams: profileParamsSchema
      .merge(monthInReviewParamsSchema),
    query: extendedMediaQuerySchema,
    method: 'GET',
    responses: {
      200: monthInReviewResponseSchema,
    },
  },
  year_in_review: {
    summary: 'Get year in review',
    description: `#### 🔓 OAuth Optional ✨ Extended Info
Returns a year-in-review summary for a user. Send the \`year\` path parameter to choose the review period.`,
    path: '/yir/:year',
    pathParams: profileParamsSchema
      .merge(yearInReviewParamsSchema),
    query: extendedMediaQuerySchema,
    method: 'GET',
    responses: {
      200: yearInReviewResponseSchema,
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
  blockedUserResponseSchema,
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
  userReportRequestSchema,
  userStatsResponseSchema,
  watchActionSchema,
  watchingResponseSchema,
};

export type ProfileParams = z.infer<typeof profileParamsSchema>;
export type UserReportRequest = z.infer<typeof userReportRequestSchema>;
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
export type BlockedUserResponse = z.infer<typeof blockedUserResponseSchema>;
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
export type YearInReviewParams = z.infer<typeof yearInReviewParamsSchema>;
export type YearInReviewResponse = z.infer<typeof yearInReviewResponseSchema>;

export type ReactedCommentResponse = z.infer<
  typeof reactedCommentResponseSchema
>;
