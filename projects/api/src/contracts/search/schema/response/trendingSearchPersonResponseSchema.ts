import { int64, z } from '../../../_internal/z.ts';
import { personResponseSchema } from '../../../people/schema/response/personResponseSchema.ts';

export const trendingSearchPersonResponseSchema = z.object({
  id: int64(z.number().int()),
  count: z.number().int(),
  type: z.literal('person'),
  person: personResponseSchema.nullish(),
});
