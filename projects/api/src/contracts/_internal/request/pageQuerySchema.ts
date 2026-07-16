import { z } from '../z.ts';

/** Zod schema for the page query parameters. */
export const pageQuerySchema = z.object({
  page: z.number().int().nullish().openapi({
    description: 'The page number to retrieve',
  }),
  limit: z.number().int().nullish().openapi({
    description: 'The number of items per page',
  }),
});
