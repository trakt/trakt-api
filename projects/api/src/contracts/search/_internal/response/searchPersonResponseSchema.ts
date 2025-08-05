import { z } from '../../../_internal/z.ts';
import { peopleSummaryResponseSchema } from '../../../people/_internal/response/peopleSummaryResponseSchema.ts';

export const searchPersonResponseSchema = z.object({
  score: z.number().int(),
  type: z.literal('person'),
  person: peopleSummaryResponseSchema,
});
