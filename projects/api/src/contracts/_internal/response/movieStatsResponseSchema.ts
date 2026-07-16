import { z } from '../z.ts';
import { episodeStatsResponseSchema } from './episodeStatsResponseSchema.ts';

/** Zod schema for the movie stats response. */
export const movieStatsResponseSchema = episodeStatsResponseSchema.extend({
  favorited: z.number().int(),
  recommended: z.number().int(),
});
