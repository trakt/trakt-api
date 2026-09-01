import { recommendationSourceSchema } from '../../../_internal/response/recommendationSourceSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const movieRecommendationsResponseSchema = z.object({
  movie: movieResponseSchema,
  score: z.string().nullish().describe('Relevance score of the entry.'),
  sources: z.array(recommendationSourceSchema).nullish(),
});
