import { builder } from '../_internal/builder.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { mediaReportRequestSchema } from '../_internal/request/mediaReportRequestSchema.ts';
import { z } from '../_internal/z.ts';

export const seasons = builder.router({
  report: {
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
