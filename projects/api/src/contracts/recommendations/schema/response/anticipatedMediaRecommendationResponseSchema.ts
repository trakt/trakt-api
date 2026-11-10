import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { anticipatedRecommendationBaseSchema } from './anticipatedRecommendationBaseSchema.ts';

/** Zod schema for the anticipated media recommendation response. */
export const anticipatedMediaRecommendationResponseSchema =
  anticipatedRecommendationBaseSchema.extend({
    movie: movieResponseSchema.nullish(),
    show: showResponseSchema.nullish(),
  });
