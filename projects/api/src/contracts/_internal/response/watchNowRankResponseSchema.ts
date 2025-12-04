import { z } from '../z.ts';

export const watchNowRankResponseSchema = z.object({
  rank: z.number().nullish(),
  delta: z.number().nullish(),
  link: z.string().nullish(),
});
