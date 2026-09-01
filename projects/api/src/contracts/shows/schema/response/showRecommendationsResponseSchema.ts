import { recommendationSourceSchema } from '../../../_internal/response/recommendationSourceSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const showRecommendationsResponseSchema = z.object({
  show: showResponseSchema,
  score: z.string().nullish().describe('Relevance score of the entry.'),
  sources: z.array(recommendationSourceSchema).nullish(),
});
