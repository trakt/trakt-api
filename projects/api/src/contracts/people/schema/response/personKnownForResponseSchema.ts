import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/**
 * A single "known for" credit: a movie or show this person is best known
 * for. Modeled as one flat object with `movie`/`show` nullish rather than a
 * `z.union` - OpenAPI codegen turns a union `oneOf` into a model with all
 * fields required, so consumers get a wrong schema. Discriminate by `type`
 * (`movie` entries carry `movie`, `show` entries carry `show`).
 */
export const personKnownForResponseSchema = z.object({
  type: z.enum(['movie', 'show']),
  characters: z.array(z.string()),
  jobs: z.array(z.string()),
  episode_count: z.number().int(),
  series_regular: z.boolean(),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
