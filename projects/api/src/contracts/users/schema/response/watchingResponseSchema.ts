import { typedEpisodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { typedMovieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { asString, z } from '../../../_internal/z.ts';

const commonWatchingResponseSchema = z.object({
  expires_at: z.string().datetime(),
  started_at: z.string().datetime(),
  action: asString(z.enum(['checkin', 'scrobble'])),
});

const movieWatchingResponseSchema = commonWatchingResponseSchema
  .merge(typedMovieResponseSchema);

const episodeWatchingResponseSchema = commonWatchingResponseSchema
  .merge(typedEpisodeResponseSchema);

export const watchingResponseSchema = z.discriminatedUnion('type', [
  movieWatchingResponseSchema,
  episodeWatchingResponseSchema,
]);
