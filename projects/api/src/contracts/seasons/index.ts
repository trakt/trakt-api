import { builder } from '../_internal/builder.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { mediaReportRequestSchema } from '../_internal/request/mediaReportRequestSchema.ts';
import { z } from '../_internal/z.ts';

/** ts-rest contract for the `seasons` endpoints. */
export const seasons = builder.router({
  report: {
    summary: 'Report a season',
    description: `#### 🔒 OAuth Required
Report a season for moderator review. Send a reason and optional message in the request body; duplicate pending reports return \`409\`.`,
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
  pathPrefix: '/seasons/:id',
});
