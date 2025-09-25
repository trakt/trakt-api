import { z } from '../../../_internal/z.ts';

export const recentSearchRequestSchema = z.object({
  query: z.string(),
  id: z.number().int(),
  type: z.enum(['movies', 'shows', 'people']),
});
