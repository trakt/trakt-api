import { builder } from '../_internal/builder.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { commentResponseSchema } from '../_internal/response/commentResponseSchema.ts';
import { z } from '../_internal/z.ts';
import { commentReplyParamsSchema } from './_internal/requests/commentReplyParamsSchema.ts';
import { commentLikeResponseSchema } from './_internal/responses/commentLikeResponseSchema.ts';

export const comments = builder.router({
  likes: {
    path: '/likes',
    method: 'GET',
    pathParams: idParamsSchema,
    query: pageQuerySchema,
    responses: {
      200: commentLikeResponseSchema.array(),
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
    body: z.undefined(),
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
}, {
  pathPrefix: '/comments/:id',
});

export type CommentLikesResponse = z.infer<typeof commentLikeResponseSchema>;
export type CommentReplyParams = z.infer<typeof commentReplyParamsSchema>;
