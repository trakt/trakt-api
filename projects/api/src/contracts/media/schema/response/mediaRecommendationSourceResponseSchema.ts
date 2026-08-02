import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/**
 * A single source that contributed to a media recommendation: the user's
 * activity or favorite on a related movie or show, or a shared subgenre, as one
 * flat object with the shape-specific fields nullish. `subgenres` is only
 * present when `type` is `subgenre`; `movie`/`show` discriminate the anchor's
 * shape.
 */
export const mediaRecommendationSourceResponseSchema = z.object({
  id: z.number().int(),
  type: z.enum(['activity', 'favorite', 'subgenre']),
  stars: z.number().int().nullable(),
  subgenres: z.object({
    id: z.number().int(),
    name: z.string(),
    slug: z.string().nullable(),
  }).array().nullish(),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
