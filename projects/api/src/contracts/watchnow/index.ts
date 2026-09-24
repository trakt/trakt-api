import { builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';
import {
  watchNowSourceResponseSchema,
  watchNowSourcesResponseSchema,
  watchNowSourceTypeSchema,
} from './schema/response/watchNowSourcesResponseSchema.ts';

/** ts-rest contract for the `watchnow` endpoints. */
export const watchnow = builder.router({
  sources: {
    all: {
      summary: 'Get watch now sources',
      description:
        '#### 🫣 Limited Access\nThis endpoint is documented for visibility, but access is currently limited and may not be available to all API consumers.\n\nReturns all watch now sources supported by Trakt, including provider metadata used by watch now routes.',
      path: '/sources',
      method: 'GET',
      responses: {
        200: watchNowSourcesResponseSchema.array(),
      },
    },
    country: {
      summary: 'Get watch now sources by country',
      description:
        '#### 🫣 Limited Access\nThis endpoint is documented for visibility, but access is currently limited and may not be available to all API consumers.\n\nReturns watch now sources available in a country. Use the `countryCode` path parameter to request country-specific provider metadata.',
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

export {
  watchNowSourceResponseSchema,
  watchNowSourcesResponseSchema,
  watchNowSourceTypeSchema,
};

/** The primary offer type of a watch now source. */
export type WatchNowSourceType = z.infer<typeof watchNowSourceTypeSchema>;

/** The watch now sources response payload. */
export type WatchNowSourcesResponse = z.infer<
  typeof watchNowSourcesResponseSchema
>;
/** The watch now source response payload. */
export type WatchNowSourceResponse = z.infer<
  typeof watchNowSourceResponseSchema
>;
