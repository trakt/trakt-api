import { double, z } from '../../../_internal/z.ts';
import { personResponseSchema } from '../../../people/schema/response/personResponseSchema.ts';

/** Zod schema for the search person response. */
export const searchPersonResponseSchema = z.object({
  score: double(z.number()),
  type: z.literal('person'),
  person: personResponseSchema.nullish(),
});
