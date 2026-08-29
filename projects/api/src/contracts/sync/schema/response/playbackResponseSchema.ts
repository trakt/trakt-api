import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { playbackItemResponseSchema } from './playbackItemResponseSchema.ts';

/**
 * A single paused playback item: a movie OR an episode. Modeled as one flat
 * object with every shape-specific field nullish rather than a `z.union` -
 * OpenAPI codegen turns a union `oneOf` into a model with all fields required,
 * so consumers get a wrong schema. With nullish fields the generated model is
 * correct; discriminate on `type` (movie items carry `movie`, episode items
 * carry `episode` and the parent `show`).
 */
export const playbackResponseSchema = playbackItemResponseSchema.extend({
  type: z.enum(['movie', 'episode']),
  movie: movieResponseSchema.nullish(),
  episode: episodeResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
