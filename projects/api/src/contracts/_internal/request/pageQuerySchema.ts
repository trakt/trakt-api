import { z } from '../z.ts';

/** Zod schema for the page query parameters. */
export const pageQuerySchema = z.object({
  page: z.number().int().nullish().openapi({
    description: 'The page number to retrieve',
  }),
  limit: z.number().int().nullish().openapi({
    description:
      'The number of items per page. The default varies per endpoint, so send an explicit value rather than relying on it. The maximum is 250; a larger value is clamped to it rather than rejected.',
  }),
});
