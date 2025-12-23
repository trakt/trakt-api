import { z } from '../z.ts';

export const watchNowRankResponseSchema = z.object({
  rank: z.number().int().nullish(),
  delta: z.number().int().nullish(),
  link: z.string().nullish(),
});
