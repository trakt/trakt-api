import { z } from '../../../_internal/z.ts';

/** Zod schema for the recent search request. */
export const recentSearchRequestSchema = z.object({
  query: z.string(),
  id: z.number().int(),
  type: z.enum(['movies', 'shows', 'people', 'lists']),
});
