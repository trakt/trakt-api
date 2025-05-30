import { z } from '../z.ts';

export const mediaFilterParamsSchema = z.object({
  watchnow: z.enum(['favorites', 'any']).nullish(),
  genres: z.string().nullish(),
  years: z.string().nullish(),
  ratings: z.string().nullish(),
});
