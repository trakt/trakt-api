import { z } from '../../../_internal/z.ts';

/** Zod schema for the year in review range parameters. */
export const yearInReviewRangeParamsSchema = z.object({
  year: z.number().int(),
  year_end: z.number().int(),
});
