import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { recommendationBaseSchema } from './recommendationBaseSchema.ts';

/** Zod schema for a show recommendation. */
export const showRecommendationResponseSchema = recommendationBaseSchema.extend(
  {
    show: showResponseSchema,
  },
);
