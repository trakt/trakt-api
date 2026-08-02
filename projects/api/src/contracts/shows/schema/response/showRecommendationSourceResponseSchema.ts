import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/**
 * A single source that contributed to a show recommendation: the user's
 * activity or favorite on a related show, or a shared subgenre. `subgenres`
 * is only present when `type` is `subgenre`.
 */
export const showRecommendationSourceResponseSchema = z.object({
  id: z.number().int(),
  type: z.enum(['activity', 'favorite', 'subgenre']),
  stars: z.number().int().nullable(),
  subgenres: z.object({
    id: z.number().int(),
    name: z.string(),
    slug: z.string().nullable(),
  }).array().nullish(),
  show: showResponseSchema,
});
