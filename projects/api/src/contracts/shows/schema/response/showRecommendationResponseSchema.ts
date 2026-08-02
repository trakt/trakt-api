import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { showRecommendationSourceResponseSchema } from './showRecommendationSourceResponseSchema.ts';

/** Zod schema for a single show recommendation, including its score and the sources that produced it. */
export const showRecommendationResponseSchema = z.object({
  show: showResponseSchema,
  score: z.number(),
  sources: showRecommendationSourceResponseSchema.array(),
});
