import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { asString, z } from '../../../_internal/z.ts';

/**
 * The user's currently-watching item: a movie or an episode. One flat
 * object with every shape-specific field nullish rather than `z.union` -
 * see schemas.md. Discriminate by which of `movie` / `episode` is present.
 */
export const watchingResponseSchema = z.object({
  expires_at: z.string().datetime(),
  started_at: z.string().datetime(),
  action: asString(z.enum(['checkin', 'scrobble'])),
  type: z.enum(['movie', 'episode']),
  movie: movieResponseSchema.nullish(),
  episode: episodeResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
