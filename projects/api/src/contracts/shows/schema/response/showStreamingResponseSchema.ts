import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the show streaming response. */
export const showStreamingResponseSchema = z.object({
  rank: z.number().int(),
  delta: z.number().int().nullish(),
  show: showResponseSchema,
});
