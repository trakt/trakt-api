import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const showStreamingResponseSchema = z.object({
  rank: z.number().int(),
  delta: z.number().int().nullable(),
  show: showResponseSchema,
});
