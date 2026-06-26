import { builder } from '../_internal/builder.ts';
import { extendedProfileQuerySchema } from '../_internal/request/extendedProfileQuerySchema.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { limitlessQuerySchema } from '../_internal/request/limitlessQuerySchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { commentResponseSchema } from '../_internal/response/commentResponseSchema.ts';
import { episodeResponseSchema } from '../_internal/response/episodeResponseSchema.ts';
import { likeResponseSchema } from '../_internal/response/likeResponseSchema.ts';
import { listResponseSchema } from '../_internal/response/listResponseSchema.ts';
import { movieResponseSchema } from '../_internal/response/movieResponseSchema.ts';
import {
  reactionEnumSchema,
  reactionsResponseSchema,
  reactionsSummaryResponseSchema,
  reactionTypeSchema,
} from '../_internal/response/reactionsResponseSchema.ts';
import { showResponseSchema } from '../_internal/response/showResponseSchema.ts';
import { z } from '../_internal/z.ts';
import { commentPostParamsSchema } from './schema/requests/commentPostParamsSchema.ts';
import { commentReplyParamsSchema } from './schema/requests/commentReplyParamsSchema.ts';
import { commentReportRequestSchema } from './schema/requests/commentReportRequestSchema.ts';

const commentActivityParamsSchema = z.object({
  comment_type: z.string().describe('Comment type filter.'),
  type: z.string().describe('Media type filter.'),
});

const includeRepliesQuerySchema = z.object({
  include_replies: z.boolean().optional().describe(
    'Include replies inline alongside top level comments.',
  ),
});

const commentItemResponseSchema = z.union([
  movieResponseSchema,
  showResponseSchema,
  episodeResponseSchema,
  listResponseSchema,
]);

const REACTIONS_LEVEL = builder.router({
  summary: {
    summary: 'Get reaction summary',
    description:
      'Returns reaction totals for a comment, grouped by reaction type.',
    path: '/summary',
    method: 'GET',
    responses: {
      200: reactionsSummaryResponseSchema,
    },
  },
  all: {
    summary: 'Get comment reactions',
    description: `#### 📄 Pagination ✨ Extended Info
Returns users and reaction details for every reaction on a comment. Use pagination and \`extended\` to control the response.`,
    path: '/',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema)
      .merge(limitlessQuerySchema),
    responses: {
      200: reactionsResponseSchema.array(),
    },
  },
  add: {
    summary: 'Add comment reaction',
    description: `#### 🔒 OAuth Required
Add a reaction to a comment. Use \`reaction_type\` to choose the reaction; a successful create returns \`201\` with no response body.`,
    path: '/:reaction_type',
    method: 'POST',
    body: z.undefined(),
    pathParams: reactionTypeSchema,
    responses: {
      201: z.undefined(),
    },
  },
  remove: {
    summary: 'Remove comment reaction',
    description: `#### 🔒 OAuth Required
Remove a reaction from a comment. Use \`reaction_type\` to choose the reaction; a successful delete returns \`204\` with no response body.`,
    path: '/:reaction_type',
    method: 'DELETE',
    pathParams: z.object({
      reaction_type: reactionEnumSchema.optional(),
    }),
    responses: {
      204: z.undefined(),
    },
  },
}, {
  pathPrefix: '/reactions',
});

const ENTITY_LEVEL = builder.router({
  summary: {
    summary: 'Get a comment or reply',
    description: `#### 😁 Emojis
Returns a single comment and indicates how many replies it has. Use [**/comments/:id/replies**](/reference/comments/replies/) to get the actual replies.`,
    path: '',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: commentResponseSchema,
    },
  },
  item: {
    summary: 'Get the attached media item',
    description:
      '#### ✨ Extended Info\nReturns the media item this comment is attached to. The media type can be `movie`, `show`, `season`, `episode`, or `list` and it also returns the standard media object for that media type.',
    path: '/item',
    method: 'GET',
    pathParams: idParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: commentItemResponseSchema,
    },
  },
  likes: {
    summary: 'Get all users who liked a comment',
    description: `#### 📄 Pagination
Returns all users who liked a comment. If you only need the \`replies\` count, the main \`comment\` object already has that, so no need to use this method.`,
    path: '/likes',
    method: 'GET',
    pathParams: idParamsSchema,
    query: pageQuerySchema,
    responses: {
      200: likeResponseSchema.array(),
    },
  },
  like: {
    summary: 'Like a comment',
    description: `#### 🔒 OAuth Required
Votes help determine popular comments. Only one like is allowed per comment per user.`,
    path: '/like',
    method: 'POST',
    pathParams: idParamsSchema,
    body: z.undefined(),
    responses: {
      204: z.undefined(),
    },
  },
  unlike: {
    summary: 'Remove like on a comment',
    description: `#### 🔒 OAuth Required
Remove a like on a comment.`,
    path: '/like',
    method: 'DELETE',
    pathParams: idParamsSchema,
    responses: {
      204: z.undefined(),
    },
  },
  report: {
    summary: 'Report a comment',
    description: `#### 🔒 OAuth Required
Report a comment for moderator review. Send a \`reason\` and optional \`message\` with additional context. A user can only have one \`pending\` report per comment.

| reason | description |
|---|---|
| \`spoilers\` | Contains spoilers |
| \`language\` | Not in English |
| \`abusive\` | Harassment or abusive behavior |
| \`spam\` | Spam or self-promotion |
| \`bigotry\` | Bigotry, hate speech, or discrimination |
| \`political\` | Political attack |
| \`offtopic\` | Off topic |
| \`support\` | Support question |
| \`duplicate\` | Duplicate comment |
| \`too_short\` | Too short to be useful |
| \`other\` | Anything else (add details in \`message\`) |`,
    path: '/report',
    method: 'POST',
    pathParams: idParamsSchema,
    body: commentReportRequestSchema,
    responses: {
      201: z.undefined(),
      400: z.undefined(),
      409: z.undefined(),
    },
  },
  replies: {
    summary: 'Get replies for a comment',
    description: `#### 🔓 OAuth Optional 📄 Pagination 😁 Emojis

Returns all replies for a comment. It is possible these replies could have replies themselves, so in that case you would just call [**/comments/:id/replies**](/reference/comments/replies/) again with the new comment \`id\`.

> ### Note
> _If you send OAuth, replies from blocked users will be automatically filtered out._`,
    path: '/replies',
    method: 'GET',
    pathParams: idParamsSchema,
    query: extendedProfileQuerySchema
      .merge(pageQuerySchema),
    responses: {
      200: commentResponseSchema.array(),
    },
  },
  reply: {
    summary: 'Post a reply for a comment',
    description: `#### 🔒 OAuth Required 😁 Emojis
Add a new reply to an existing comment. Make sure to allow and encourage *spoilers* to be indicated in your app and follow the rules listed above.

> ### Note
> Replies can only be added to top level comments. If you try to reply to a reply, a \`404\` HTTP status code is returned.

#### JSON POST Data
| Key | Type | Default | Value |
|---|---|---|---|
| \`comment\` * | string |  | Text for the reply. |
| \`spoiler\` | boolean | \`false\` | Is this a spoiler? |`,
    path: '/replies',
    method: 'POST',
    pathParams: idParamsSchema,
    body: commentReplyParamsSchema,
    responses: {
      201: commentResponseSchema,
    },
  },
  edit: {
    summary: 'Update a comment or reply',
    description: `#### 🔒 OAuth Required 😁 Emojis
Update a single comment. The OAuth user must match the author of the comment in order to update it. If not, a \`401\` HTTP status is returned.

#### JSON POST Data
| Key | Type | Default | Value |
|---|---|---|---|
| \`comment\` | string |  | Text for the comment. |
| \`spoiler\` | boolean | \`false\` | Is this a spoiler? |`,
    path: '/',
    method: 'PUT',
    pathParams: idParamsSchema,
    body: commentReplyParamsSchema,
    responses: {
      200: commentResponseSchema,
    },
  },
  delete: {
    summary: 'Delete a comment or reply',
    description: `#### 🔒 OAuth Required
Delete a single comment. The OAuth user must match the author of the comment in order to delete it. If not, a \`401\` HTTP status code is returned. The comment must also be less than 2 weeks old or have 0 replies. If not, a \`409\` HTTP status is returned.`,
    path: '/',
    method: 'DELETE',
    pathParams: idParamsSchema,
    responses: {
      204: z.undefined(),
    },
  },
  reactions: REACTIONS_LEVEL,
}, {
  pathPrefix: '/:id',
});

const GLOBAL_LEVEL = builder.router({
  trending: {
    summary: 'Get trending comments',
    description:
      '#### 📄 Pagination ✨ Extended Info 😁 Emojis\nReturns all comments with the most likes and replies over the last 7 days. You can optionally filter by the `comment_type` and media `type` to limit what gets returned. If you want to `include_replies` that will return replies in place alongside top level comments.',
    path: '/trending/:comment_type/:type',
    method: 'GET',
    pathParams: commentActivityParamsSchema,
    query: extendedProfileQuerySchema
      .merge(pageQuerySchema)
      .merge(limitlessQuerySchema)
      .merge(includeRepliesQuerySchema),
    responses: {
      200: commentResponseSchema.array(),
    },
  },
  recent: {
    summary: 'Get recently created comments',
    description:
      '#### 📄 Pagination ✨ Extended Info 😁 Emojis\nReturns the most recently written comments across all of Trakt. You can optionally filter by the `comment_type` and media `type` to limit what gets returned. If you want to `include_replies` that will return replies in place alongside top level comments.',
    path: '/recent/:comment_type/:type',
    method: 'GET',
    pathParams: commentActivityParamsSchema,
    query: extendedProfileQuerySchema
      .merge(pageQuerySchema)
      .merge(limitlessQuerySchema)
      .merge(includeRepliesQuerySchema),
    responses: {
      200: commentResponseSchema.array(),
    },
  },
  updates: {
    summary: 'Get recently updated comments',
    description:
      '#### 📄 Pagination ✨ Extended Info 😁 Emojis\nReturns the most recently updated comments across all of Trakt. You can optionally filter by the `comment_type` and media `type` to limit what gets returned. If you want to `include_replies` that will return replies in place alongside top level comments.',
    path: '/updates/:comment_type/:type',
    method: 'GET',
    pathParams: commentActivityParamsSchema,
    query: extendedProfileQuerySchema
      .merge(pageQuerySchema)
      .merge(limitlessQuerySchema)
      .merge(includeRepliesQuerySchema),
    responses: {
      200: commentResponseSchema.array(),
    },
  },
  post: {
    summary: 'Post a comment',
    description: `#### 🔒 OAuth Required 😁 Emojis
Add a new comment to a movie, show, season, episode, or list. Make sure to allow and encourage *spoilers* to be indicated in your app and follow the rules listed above.

#### JSON POST Data
| Key | Type | Default | Value |
|---|---|---|---|
| item * | object | | \`movie\`, \`show\`, \`season\`, \`episode\`, or \`list\` object. (see examples ->) |
| \`comment\` * | string |  | Text for the comment. |
| \`spoiler\` | boolean | \`false\` | Is this a spoiler? |
| \`sharing\`  | object | | Control sharing to any connected social networks. (see below &#8595;) |

#### Sharing
The \`sharing\` object is optional and will apply the user's settings if not sent. If \`sharing\` is sent, each key will override the user's setting for that social network. Send \`true\` to post or \`false\` to not post on the indicated social network. You can see which social networks a user has connected with the [**/users/settings**](/reference/users/settings) method.

| Key | Type |
|---|---|
| \`twitter\` | boolean |
| \`tumblr\` | boolean |
| \`medium\` | boolean |`,
    path: '/',
    method: 'POST',
    body: commentPostParamsSchema,
    responses: {
      201: commentResponseSchema,
    },
  },
});

export const comments = builder.router({
  ...ENTITY_LEVEL,
  ...GLOBAL_LEVEL,
}, {
  pathPrefix: '/comments',
});

export {
  commentPostParamsSchema,
  commentReplyParamsSchema,
  commentReportRequestSchema,
  reactionsResponseSchema,
  reactionsSummaryResponseSchema,
  reactionTypeSchema,
};

export type CommentReplyParams = z.infer<typeof commentReplyParamsSchema>;
export type CommentPostParams = z.infer<typeof commentPostParamsSchema>;
export type CommentReportRequest = z.infer<typeof commentReportRequestSchema>;

export type ReactionsSummaryResponse = z.infer<
  typeof reactionsSummaryResponseSchema
>;
export type ReactionsResponse = z.infer<typeof reactionsResponseSchema>;
export type ReactionType = z.infer<typeof reactionTypeSchema>;
