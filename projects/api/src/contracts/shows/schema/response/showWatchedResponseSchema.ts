import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { watchedStatsResponseSchema } from '../../../_internal/response/watchedStatsResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the show watched response. */
export const showWatchedResponseSchema = watchedStatsResponseSchema.extend({
  collector_count: z.number().int(),
  show: showResponseSchema,
});
