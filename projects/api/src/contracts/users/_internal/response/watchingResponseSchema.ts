import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { asString, z } from '../../../_internal/z.ts';

const commonWatchingResponseSchema = z.object({
  expires_at: z.string().datetime(),
  started_at: z.string().datetime(),
  action: asString(z.enum(['checkin', 'scrobble'])),
});

const movieWatchingResponseSchema = commonWatchingResponseSchema.extend({
  type: z.literal('movie'),
  movie: movieResponseSchema,
});

const episodeWatchingResponseSchema = commonWatchingResponseSchema.extend({
  type: z.literal('episode'),
  episode: episodeResponseSchema,
  show: showResponseSchema,
});

export const watchingResponseSchema = z.discriminatedUnion('type', [
  movieWatchingResponseSchema,
  episodeWatchingResponseSchema,
]);
