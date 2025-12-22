import { z } from '../../../_internal/z.ts';

export const yearInReviewParamsSchema = z.object({
  year: z.number().int(),
});
