import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { anticipatedRecommendationBaseSchema } from './anticipatedRecommendationBaseSchema.ts';

/** Zod schema for the anticipated movie recommendation response. */
export const anticipatedMovieRecommendationResponseSchema =
  anticipatedRecommendationBaseSchema.extend({
    movie: movieResponseSchema,
  });
