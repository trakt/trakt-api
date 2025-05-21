import { z } from '../z.ts';
import { movieStatsResponseSchema } from './movieStatsResponseSchema.ts';

export const showStatsResponseSchema = movieStatsResponseSchema.extend({
  collected_episodes: z.number().int(),
});
