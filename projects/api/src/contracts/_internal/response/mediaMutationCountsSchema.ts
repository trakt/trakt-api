import { z } from '../z.ts';

/**
 * FIXME: make this more generic and reuse in cases
 * where only subsets are returned
 */
export const mediaMutationCountsSchema = z.object({
  movies: z.number().int(),
  shows: z.number().int(),
  seasons: z.number().int(),
  episodes: z.number().int(),
});
