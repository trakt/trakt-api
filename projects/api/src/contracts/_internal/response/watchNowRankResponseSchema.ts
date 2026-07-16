import { z } from '../z.ts';

/** Zod schema for the watch now rank response. */
export const watchNowRankResponseSchema = z.object({
  rank: z.number().int().nullish(),
  delta: z.number().int().nullish(),
  link: z.string().nullish(),
});
