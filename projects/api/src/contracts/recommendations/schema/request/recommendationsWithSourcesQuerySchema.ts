import { z } from '../../../_internal/z.ts';
import { recommendationsQuerySchema } from './recommendationsQuerySchema.ts';

/** Zod schema for the recommendations query parameters, with `page` and an optional `limit`. */
export const recommendationsWithSourcesQuerySchema =
  recommendationsQuerySchema.extend({
    page: z.number().int().nullish().openapi({
      description: 'The page number to retrieve.',
    }),
    limit: z.number().int().nullish().openapi({
      description:
        'Limit the number of results. Defaults to `10`, up to `100`.',
    }),
  });
