import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { mediaRecommendationSourceResponseSchema } from './mediaRecommendationSourceResponseSchema.ts';

/**
 * A single entry in the mixed recommendations feed: a recommended movie OR
 * show, its score, and the sources that produced it, as one flat object with
 * the shape-specific fields nullish.
 */
export const mediaRecommendationResponseSchema = z.object({
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
  score: z.number(),
  sources: mediaRecommendationSourceResponseSchema.array(),
});
