import { z } from '../../../_internal/z.ts';

/** Zod schema for the fields every recommendation carries beside its title. */
export const recommendationBaseSchema = z.object({
  score: z.number(),
});
