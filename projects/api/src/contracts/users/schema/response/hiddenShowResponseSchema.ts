import { typedShowResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the hidden show response. */
export const hiddenShowResponseSchema = z.object({
  hidden_at: z.string().datetime().nullish(),
}).merge(typedShowResponseSchema);
