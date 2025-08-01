import { typedShowResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const searchShowResponseSchema = z.object({
  score: z.number().int(),
}).merge(typedShowResponseSchema);
