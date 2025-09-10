import { int64, z } from '../../../_internal/z.ts';
import { personResponseSchema } from '../../../people/schema/response/personResponseSchema.ts';

export const searchPersonResponseSchema = z.object({
  score: int64(z.number().int()),
  type: z.literal('person'),
  person: personResponseSchema.nullish(),
});
