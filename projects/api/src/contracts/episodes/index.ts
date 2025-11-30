import { builder } from '../_internal/builder.ts';
import { linksQuerySchema } from '../_internal/request/linksQuerySchema.ts';
import { watchNowParamsSchema } from '../_internal/request/watchNowParamsSchema.ts';
import { watchNowResponseSchema } from '../_internal/response/watchNowResponseSchema.ts';

export const episodes = builder.router({
  watchnow: {
    path: '/watchnow/:country',
    query: linksQuerySchema,
    method: 'GET',
    pathParams: watchNowParamsSchema,
    responses: {
      200: watchNowResponseSchema,
    },
  },
}, {
  pathPrefix: '/episodes/:id',
});
