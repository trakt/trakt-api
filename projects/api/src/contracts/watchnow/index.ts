import { builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';
import {
  type watchNowSourceResponseSchema,
  watchNowSourcesResponseSchema,
} from './_internal/response/watchNowSourcesResponseSchema.ts';

export const watchnow = builder.router({
  sources: {
    all: {
      path: '/sources',
      method: 'GET',
      responses: {
        200: watchNowSourcesResponseSchema.array(),
      },
    },
    country: {
      path: '/sources/:countryCode',
      method: 'GET',
      pathParams: z.object({
        countryCode: z.string().optional(),
      }),
      responses: {
        200: watchNowSourcesResponseSchema.array(),
      },
    },
  }
}, {
  pathPrefix: '/watchnow',
});

export type WatchNowSourcesResponse = z.infer<
  typeof watchNowSourcesResponseSchema
>;
export type WatchNowSourceResponse = z.infer<
  typeof watchNowSourceResponseSchema
>;
