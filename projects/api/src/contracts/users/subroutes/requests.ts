import { builder } from '../../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../../_internal/request/extendedQuerySchemaFactory.ts';
import { internalIdParamsSchema } from '../../_internal/request/internalIdParamsSchema.ts';
import { z } from '../../_internal/z.ts';
import { followerResponseSchema } from '../schema/response/followerResponseSchema.ts';
import { requestsResponseSchema } from '../schema/response/requestsResponseSchema.ts';

export const requests = builder.router({
  follow: {
    summary: 'Get follow requests',
    description: `#### 🔒 OAuth Required ✨ Extended Info
List a user's pending follow requests so they can either approve or deny them.`,
    path: '/',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full']>(),
    responses: {
      200: requestsResponseSchema.array(),
    },
  },
  following: {
    summary: 'Get pending following requests',
    description: `#### 🔒 OAuth Required ✨ Extended Info
List a user's pending following requests that they're waiting for the other user's to approve.`,
    path: '/following',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full']>(),
    responses: {
      200: requestsResponseSchema.array(),
    },
  },
  approve: {
    summary: 'Approve follow request',
    description: `#### 🔒 OAuth Required
Approve a follower using the \`id\` of the request. If the \`id\` is not found, was already approved, or was already denied, a \`404\` error will be returned.`,
    path: '/:id',
    method: 'POST',
    query: extendedQuerySchemaFactory<['full']>(),
    pathParams: internalIdParamsSchema,
    body: z.undefined(),
    responses: {
      200: followerResponseSchema,
      404: z.undefined(),
    },
  },
  deny: {
    summary: 'Deny follow request',
    description: `#### 🔒 OAuth Required
Deny a follower using the \`id\` of the request. If the \`id\` is not found, was already approved, or was already denied, a \`404\` error will be returned.`,
    path: '/:id',
    method: 'DELETE',
    pathParams: internalIdParamsSchema,
    responses: {
      204: z.undefined(),
      404: z.undefined(),
    },
  },
}, {
  pathPrefix: '/requests',
});

export type RequestsResponse = z.infer<typeof requestsResponseSchema>;
