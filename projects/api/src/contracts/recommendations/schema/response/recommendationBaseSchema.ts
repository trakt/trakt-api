import { z } from '../../../_internal/z.ts';
import { recommendationPeopleReasonSchema } from './recommendationPeopleReasonSchema.ts';
import { recommendationSourceSchema } from './recommendationSourceSchema.ts';

/** Zod schema for the fields every recommendation carries beside its title. */
export const recommendationBaseSchema = z.object({
  score: z.number(),
  sources: z.array(recommendationSourceSchema),
  people: z.array(recommendationPeopleReasonSchema).nullish(),
});
