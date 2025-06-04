import { z } from '../../../_internal/z.ts';

export const monthInReviewParamsSchema = z.object({
  year: z.number().int(),
  month: z.number().int(),
});
