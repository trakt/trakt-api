import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { recommendationBaseSchema } from './recommendationBaseSchema.ts';

/** Zod schema for a movie or show recommendation, the title under its own key. */
export const mediaRecommendationResponseSchema =
  recommendationBaseSchema.extend({
    movie: movieResponseSchema.nullish(),
    show: showResponseSchema.nullish(),
  });
