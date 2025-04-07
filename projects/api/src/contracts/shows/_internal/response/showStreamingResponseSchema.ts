import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const showStreamingResponseSchema = z.object({
  rank: z.number(),
  delta: z.number().nullable(),
  show: showResponseSchema,
});
