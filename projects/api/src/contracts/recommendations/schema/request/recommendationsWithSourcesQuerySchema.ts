import { z } from '../../../_internal/z.ts';
import { recommendationsQuerySchema } from './recommendationsQuerySchema.ts';

/** Zod schema for the recommendations query parameters, with `limit` optional. */
export const recommendationsWithSourcesQuerySchema =
  recommendationsQuerySchema.extend({
    limit: z.number().int().nullish().openapi({
      description:
        'Limit the number of results. Defaults to `10`, up to `100`.',
    }),
  });
