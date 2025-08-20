import { int64, z } from '../../../_internal/z.ts';
import { peopleSummaryResponseSchema } from '../../../people/_internal/response/peopleSummaryResponseSchema.ts';

export const searchPersonResponseSchema = z.object({
  score: int64(z.number().int()),
  type: z.literal('person'),
  person: peopleSummaryResponseSchema.nullish(),
});
