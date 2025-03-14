import { builder } from '../_internal/builder.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import type { z } from '../_internal/z.ts';
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
}, {
  pathPrefix: '/comments/:id',
});

export type CommentLikesResponse = z.infer<typeof commentLikeResponseSchema>;
