import { builder } from '../_internal/builder.ts';
import { extendedWatchNowQuerySchema } from '../_internal/request/extendedWatchNowQuerySchema.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { linksQuerySchema } from '../_internal/request/linksQuerySchema.ts';
import { mediaReportRequestSchema } from '../_internal/request/mediaReportRequestSchema.ts';
import { watchNowParamsSchema } from '../_internal/request/watchNowParamsSchema.ts';
import { watchNowResponseSchema } from '../_internal/response/watchNowResponseSchema.ts';
import { z } from '../_internal/z.ts';

/** ts-rest contract for the `episodes` endpoints. */
export const episodes = builder.router({
  watchnow: {
    summary: 'Get episode watch now sources',
    description: `#### 🫣 Limited Access ✨ Extended Info
This endpoint is documented for visibility, but access is currently limited and may not be available to all API consumers.

Returns streaming and watch now sources for an episode in the requested country. Use \`links\` to include provider links when available.`,
    path: '/watchnow/:country',
    query: linksQuerySchema
      .merge(extendedWatchNowQuerySchema),
    method: 'GET',
    pathParams: watchNowParamsSchema,
    responses: {
      200: watchNowResponseSchema,
    },
  },
  report: {
    summary: 'Report an episode',
    description: `#### 🔒 OAuth Required
Report an episode for moderator review. Send a reason and optional message in the request body; duplicate pending reports return \`409\`.`,
    path: '/report',
    method: 'POST',
    pathParams: idParamsSchema,
    body: mediaReportRequestSchema,
    responses: {
      201: z.undefined(),
      400: z.undefined(),
      409: z.undefined(),
    },
  },
}, {
  pathPrefix: '/episodes/:id',
});
