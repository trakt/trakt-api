import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/**
 * A single source that contributed to a movie recommendation: the user's
 * activity or favorite on a related movie, or a shared subgenre. `subgenres`
 * is only present when `type` is `subgenre`.
 */
export const movieRecommendationSourceResponseSchema = z.object({
  id: z.number().int(),
  type: z.enum(['activity', 'favorite', 'subgenre']),
  stars: z.number().int().nullable(),
  subgenres: z.object({
    id: z.number().int(),
    name: z.string(),
    slug: z.string().nullable(),
  }).array().nullish(),
  movie: movieResponseSchema,
});
