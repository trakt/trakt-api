import { typedShowResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const favoritedShowsResponseSchema = z.object({
  id: z.number().int(),
  listed_at: z.string().datetime(),
  notes: z.string().nullish(),
  rank: z.number().int(),
}).merge(typedShowResponseSchema);
