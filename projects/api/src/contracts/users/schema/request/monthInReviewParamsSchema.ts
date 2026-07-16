import { z } from '../../../_internal/z.ts';

/** Zod schema for the month in review parameters. */
export const monthInReviewParamsSchema = z.object({
  year: z.number().int(),
  month: z.number().int(),
});
