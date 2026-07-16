import { z } from '../../../_internal/z.ts';

/** Zod schema for the year in review parameters. */
export const yearInReviewParamsSchema = z.object({
  year: z.number().int(),
});
