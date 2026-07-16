import { authMetadata, builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';
import { connectRequestSchema } from './schema/request/connectRequestSchema.ts';
import { refreshParamsSchema } from './schema/request/refreshParamsSchema.ts';
import { serviceIdParamsSchema } from './schema/request/serviceIdParamsSchema.ts';
import { connectionSchema } from './schema/response/connectionResponseSchema.ts';
import { connectResponseSchema } from './schema/response/connectResponseSchema.ts';

/** ts-rest contract for the `younify` endpoints. */
export const younify = builder.router({
  connections: {
    summary: 'Get streaming connections',
    description: `#### 🔒 OAuth Required
Lists every connectable streaming service with the current user's connection status merged in, so a settings grid can render each tile in one pass. Read-only — never creates a remote younify user.

> ### IMPORTANT
> _**Array order is significant.** Clients must preserve the response order when rendering the grid; the list is returned in the intended display order._

\`vip: false\` is the free tier. \`connectable\` reflects whether the current user may connect the service on their plan. \`connected\` plus \`active\` indicate a healthy link (\`active: false\` is a broken link). \`profile\` and \`last_synced_at\` are null when not connected, and \`last_synced_at\` is normalized to \`.000Z\`.`,
    method: 'GET',
    path: '/connections',
    responses: {
      200: connectionSchema.array(),
    },
  },
  connect: {
    summary: 'Create a streaming connection',
    description: `#### 🔒 OAuth Required
Mints a signed younify web-auth URL for the client to open. Accepts the client's own \`return_url\` (deep link / universal link), validated against trakt-owned destinations only (\`trakt://…\` or \`https://*.trakt.tv\`).

A \`422\` is returned when the service is not connectable on the user's plan, and a \`400\` when the \`return_url\` is missing/invalid or no URL could be minted.`,
    method: 'POST',
    path: '/connect',
    body: connectRequestSchema,
    responses: {
      200: connectResponseSchema,
      400: z.undefined(),
      422: z.undefined(),
    },
  },
  refresh: {
    summary: 'Refresh a streaming service',
    description: `#### 🔒 OAuth Required
Queue / force a re-sync of a connected streaming service for the authenticated user.`,
    method: 'POST',
    path: '/users/refresh/:service_id',
    pathParams: serviceIdParamsSchema,
    body: z.undefined(),
    responses: {
      204: z.undefined(),
    },
  },
  refreshAll: {
    summary: 'Refresh a streaming service (full re-sync)',
    description: `#### 🔒 OAuth Required
Queue / force a re-sync of a connected streaming service for the authenticated user. The trailing \`all_data\` segment forces a full re-sync of all data rather than an incremental one.`,
    method: 'POST',
    path: '/users/refresh/:service_id/:all_data',
    pathParams: refreshParamsSchema,
    body: z.undefined(),
    responses: {
      204: z.undefined(),
    },
  },
  disconnect: {
    summary: 'Unlink a streaming service',
    description: `#### 🔒 OAuth Required
Unlink a streaming service from the authenticated user.`,
    method: 'DELETE',
    path: '/users/services/:service_id',
    pathParams: serviceIdParamsSchema,
    responses: {
      204: z.undefined(),
    },
  },
}, {
  pathPrefix: '/younify',
  metadata: authMetadata('required'),
});

export {
  connectionSchema,
  connectRequestSchema,
  connectResponseSchema,
  refreshParamsSchema,
  serviceIdParamsSchema,
};

/** The younify connection type. */
export type YounifyConnection = z.infer<typeof connectionSchema>;
/** The younify connect request payload. */
export type YounifyConnectRequest = z.infer<typeof connectRequestSchema>;
/** The younify connect response payload. */
export type YounifyConnectResponse = z.infer<typeof connectResponseSchema>;
