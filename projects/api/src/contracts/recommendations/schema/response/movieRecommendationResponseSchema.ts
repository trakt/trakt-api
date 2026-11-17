import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { recommendationBaseSchema } from './recommendationBaseSchema.ts';

/** Zod schema for a movie recommendation with the activity it came from. */
export const movieRecommendationResponseSchema =
  recommendationBaseSchema.extend({
    movie: movieResponseSchema,
  });
