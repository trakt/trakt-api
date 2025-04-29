import { z } from '../z.ts';

export const mediaFilterParamsSchema = z.object({
  watchnow: z.enum(['favorites', 'any']).optional(),
  genres: z.string().optional(),
  years: z.string().optional(),
  ratings: z.string().optional(),
});
