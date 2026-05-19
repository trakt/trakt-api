import { builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';
import {
  watchNowSourceResponseSchema,
  watchNowSourcesResponseSchema,
} from './schema/response/watchNowSourcesResponseSchema.ts';

export const watchnow = builder.router({
  sources: {
    all: {
      summary: 'Get watch now sources',
      description:
        'Returns all watch now sources supported by Trakt, including provider metadata used by watch now routes.',
      path: '/sources',
      method: 'GET',
      responses: {
        200: watchNowSourcesResponseSchema.array(),
      },
    },
    country: {
      summary: 'Get watch now sources by country',
      description:
        'Returns watch now sources available in a country. Use the `countryCode` path parameter to request country-specific provider metadata.',
      path: '/sources/:countryCode',
      method: 'GET',
      pathParams: z.object({
        countryCode: z.string().optional(),
      }),
      responses: {
        200: watchNowSourcesResponseSchema.array(),
      },
    },
  },
}, {
  pathPrefix: '/watchnow',
});

export { watchNowSourceResponseSchema, watchNowSourcesResponseSchema };

export type WatchNowSourcesResponse = z.infer<
  typeof watchNowSourcesResponseSchema
>;
export type WatchNowSourceResponse = z.infer<
  typeof watchNowSourceResponseSchema
>;
