import { z } from '../../../_internal/z.ts';

/** Zod schema for the fields every anticipated recommendation carries. */
export const anticipatedRecommendationBaseSchema = z.object({
  score: z.number(),
  released: z.string().nullable(),
});
