import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { calendarEpisodeResponseSchema } from './calendarEpisodeResponseSchema.ts';

/**
 * A single entry in a merged calendar feed (media, hot releases): an upcoming
 * movie OR an upcoming episode. Modeled as one flat object with every field
 * nullish rather than a `z.union` — OpenAPI codegen turns a union `oneOf` into
 * a model with all fields required, so consumers get a wrong schema. With
 * nullish fields the generated model is correct; discriminate by shape (movie
 * entries carry `movie`, episode entries carry `episode`/`show`).
 */
export const hotReleaseResponseSchema = z.object({
  released: z.string().nullish(),
  movie: movieResponseSchema.nullish(),
  first_aired: z.string().nullish(),
  episode: calendarEpisodeResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
