import { episodeStatsResponseSchema } from '../../../_internal/response/episodeStatsResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the season stats response. */
export const seasonStatsResponseSchema = episodeStatsResponseSchema.extend({
  collected_episodes: z.number().int(),
});
