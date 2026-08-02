import { z } from '../../../_internal/z.ts';

/** Zod schema for the sync history type path parameter. */
export const historyTypeParamsSchema = z.object({
  type: z.enum(['all', 'movies', 'shows', 'episodes', 'seasons']).openapi({
    description: 'History media type filter.',
  }),
});
