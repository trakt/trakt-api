import { z } from '../../../_internal/z.ts';

/** Zod schema for the search query parameters. */
export const searchQuerySchema = z.object({
  query: z.string().nullish().openapi({
    description: 'The search query to search all text based fields.',
  }),
});
