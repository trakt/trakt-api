import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { asString, z } from '../../../_internal/z.ts';

const commonWatchingResponseSchema = z.object({
  expires_at: z.string().datetime(),
  started_at: z.string().datetime(),
  action: asString(z.enum(['checkin', 'scrobble'])),
});

const movieWatchingResponseSchema = commonWatchingResponseSchema
  .merge(z.object({
    type: z.literal('movie'),
    movie: movieResponseSchema.nullish(),
  }));

const episodeWatchingResponseSchema = commonWatchingResponseSchema
  .merge(z.object({
    type: z.literal('episode'),
    episode: episodeResponseSchema.nullish(),
    show: showResponseSchema.nullish(),
  }));

export const watchingResponseSchema = z.union([
  movieWatchingResponseSchema,
  episodeWatchingResponseSchema,
]);
