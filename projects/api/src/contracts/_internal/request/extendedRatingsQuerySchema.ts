import { z } from '../z.ts';

/** Zod schema for the extended ratings query parameters. */
export const extendedRatingsQuerySchema = z.object({
  extended: z
    .literal('all')
    .nullish()
    .openapi({
      description:
        'Use `all` to include ratings from supported external sources.',
    }),
});
