import { builder } from '../../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../../_internal/request/extendedQuerySchemaFactory.ts';
import { internalIdParamsSchema } from '../../_internal/request/internalIdParamsSchema.ts';
import { z } from '../../_internal/z.ts';
import { followerResponseSchema } from '../schema/response/followerResponseSchema.ts';
import { requestsResponseSchema } from '../schema/response/requestsResponseSchema.ts';

export const requests = builder.router({
  follow: {
    path: '/',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full']>(),
    responses: {
      200: requestsResponseSchema.array(),
    },
  },
  following: {
    path: '/following',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full']>(),
    responses: {
      200: requestsResponseSchema.array(),
    },
  },
  approve: {
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
