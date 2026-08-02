import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { movieRecommendationSourceResponseSchema } from './movieRecommendationSourceResponseSchema.ts';

/** Zod schema for a single movie recommendation, including its score and the sources that produced it. */
export const movieRecommendationResponseSchema = z.object({
  movie: movieResponseSchema,
  score: z.number(),
  sources: movieRecommendationSourceResponseSchema.array(),
});
