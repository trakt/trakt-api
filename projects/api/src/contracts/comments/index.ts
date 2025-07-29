import { builder } from '../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { commentResponseSchema } from '../_internal/response/commentResponseSchema.ts';
import { likeResponseSchema } from '../_internal/response/likeResponseSchema.ts';
import {
  reactionEnumSchema,
  reactionsResponseSchema,
  reactionsSummaryResponseSchema,
  reactionTypeSchema,
} from '../_internal/response/reactionsResponseSchema.ts';
import { z } from '../_internal/z.ts';
import { commentPostParamsSchema } from './_internal/requests/commentPostParamsSchema.ts';
import { commentReplyParamsSchema } from './_internal/requests/commentReplyParamsSchema.ts';

const REACTIONS_LEVEL = builder.router({
  summary: {
    path: '/summary',
    method: 'GET',
    responses: {
      200: reactionsSummaryResponseSchema.array(),
    },
  },
  all: {
    path: '/',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: reactionsResponseSchema.array(),
    },
  },
  add: {
    path: '/:reaction_type',
    method: 'POST',
    body: z.undefined(),
    pathParams: reactionTypeSchema,
    responses: {
      201: z.undefined(),
    },
  },
  remove: {
    path: '/:reaction_type?',
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
  likes: {
    path: '/likes',
    method: 'GET',
    pathParams: idParamsSchema,
    query: pageQuerySchema,
    responses: {
      200: likeResponseSchema.array(),
    },
  },
  like: {
    path: '/like',
    method: 'POST',
    pathParams: idParamsSchema,
    body: z.undefined(),
    responses: {
      204: z.undefined(),
    },
  },
  unlike: {
    path: '/like',
    method: 'DELETE',
    pathParams: idParamsSchema,
    responses: {
      204: z.undefined(),
    },
  },
  replies: {
    path: '/replies',
    method: 'GET',
    pathParams: idParamsSchema,
    query: pageQuerySchema,
    responses: {
      200: commentResponseSchema.array(),
    },
  },
  reply: {
    path: '/replies',
    method: 'POST',
    pathParams: idParamsSchema,
    body: commentReplyParamsSchema,
    responses: {
      201: commentResponseSchema,
    },
  },
  edit: {
    path: '/',
    method: 'PUT',
    pathParams: idParamsSchema,
    body: commentReplyParamsSchema,
    responses: {
      200: commentResponseSchema,
    },
  },
  delete: {
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
  post: {
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

export type CommentReplyParams = z.infer<typeof commentReplyParamsSchema>;
export type CommentPostParams = z.infer<typeof commentPostParamsSchema>;

export type ReactionsSummaryResponse = z.infer<
  typeof reactionsSummaryResponseSchema
>;
export type ReactionsResponse = z.infer<typeof reactionsResponseSchema>;
export type ReactionType = z.infer<typeof reactionTypeSchema>;
