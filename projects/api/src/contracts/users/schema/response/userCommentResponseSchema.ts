import { commentResponseSchema } from '../../../_internal/response/commentResponseSchema.ts';
import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { seasonResponseSchema } from '../../../shows/schema/response/seasonResponseSchema.ts';

/**
 * A user comment attached to one of several entity shapes (movie, show, season,
 * episode). Modeled as one flat object with every shape-specific field nullish
 * rather than a `z.discriminatedUnion` — OpenAPI codegen turns a union `oneOf`
 * into a model with all fields required, so consumers get a wrong schema. With
 * nullish fields the generated model is correct; discriminate by `type` (or by
 * which of `movie`/`show`/`season`/`episode` is present).
 */
export const userCommentResponseSchema = z.object({
  type: z.enum(['movie', 'show', 'season', 'episode']),
  comment: commentResponseSchema,
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
  season: seasonResponseSchema.nullish(),
  episode: episodeResponseSchema.nullish(),
});
