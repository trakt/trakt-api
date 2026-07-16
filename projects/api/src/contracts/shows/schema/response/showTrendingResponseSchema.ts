import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the show trending response. */
export const showTrendingResponseSchema = z.object({
  watchers: z.number().int(),
  show: showResponseSchema,
});
