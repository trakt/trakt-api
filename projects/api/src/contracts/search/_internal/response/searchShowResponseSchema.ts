import { typedShowResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { int64, z } from '../../../_internal/z.ts';

export const searchShowResponseSchema = z.object({
  score: int64(z.number().int()),
}).merge(typedShowResponseSchema);
