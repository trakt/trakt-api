import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { anticipatedRecommendationBaseSchema } from './anticipatedRecommendationBaseSchema.ts';

/** Zod schema for the anticipated show recommendation response. */
export const anticipatedShowRecommendationResponseSchema =
  anticipatedRecommendationBaseSchema.extend({
    show: showResponseSchema,
  });
