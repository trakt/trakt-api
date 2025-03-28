import { z } from '../z.ts';

/**
 * FIXME: make this more generic and reuse in cases
 * where only subsets are returned
 */
export const mediaMutationCountsSchema = z.object({
  movies: z.number(),
  shows: z.number(),
  seasons: z.number(),
  episodes: z.number(),
});
