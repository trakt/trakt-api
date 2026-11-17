import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { recommendationBaseSchema } from './recommendationBaseSchema.ts';

/** Zod schema for a show recommendation with the activity it came from. */
export const showRecommendationResponseSchema = recommendationBaseSchema.extend(
  {
    show: showResponseSchema,
  },
);
