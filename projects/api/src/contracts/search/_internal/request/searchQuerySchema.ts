import { z } from '../../../_internal/z.ts';

export const searchQuerySchema = z.object({
  query: z.string().optional().openapi({
    description: 'The search query to search all text based fields.',
  }),
});
