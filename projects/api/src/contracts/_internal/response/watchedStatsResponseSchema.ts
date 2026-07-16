import { z } from '../z.ts';

/** Zod schema for the watched stats response. */
export const watchedStatsResponseSchema = z.object({
  watcher_count: z.number().int(),
  play_count: z.number().int(),
  collected_count: z.number().int(),
});
