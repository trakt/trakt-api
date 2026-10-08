import { z } from '../../../_internal/z.ts';

/** Zod schema for the year in review persona parameters. */
export const yearInReviewPersonaParamsSchema = z.object({
  year: z.number().int().min(2026),
});
