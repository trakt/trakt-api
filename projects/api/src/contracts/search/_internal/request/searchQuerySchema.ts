import { z } from '../../../_internal/z.ts';

export const searchQuerySchema = z.object({
  query: z.string().nullish().openapi({
    description: 'The search query to search all text based fields.',
  }),
});
