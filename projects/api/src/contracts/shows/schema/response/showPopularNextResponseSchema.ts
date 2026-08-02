import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the show popular/next response. */
export const showPopularNextResponseSchema = z.object({
  rank: z.number().int().nullable(),
  plays: z.number().int(),
  watchers: z.number().int(),
  show: showResponseSchema,
});
