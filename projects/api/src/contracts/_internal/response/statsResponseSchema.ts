import { z } from '../z.ts';

/** Zod schema for the stats response. */
export const statsResponseSchema = z.object({
  play_count: z.number().int(),
  minutes_watched: z.number().int(),
  minutes_left: z.number().int().nullish(),
});
