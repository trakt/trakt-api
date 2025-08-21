import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { asString, int64, z } from '../../../_internal/z.ts';

const activitySchema = z.object({
  id: int64(z.number().int()),
  activity_at: z.string().datetime(),
  action: asString(z.enum(['scrobble', 'watch', 'checkin'])),
  user: profileResponseSchema,
});

const socialEpisodeResponseSchema = z.object({
  type: z.literal('episode'),
  episode: episodeResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});

const socialMovieResponseSchema = z.object({
  type: z.literal('movie'),
  movie: movieResponseSchema.nullish(),
});

export const socialActivityResponseSchema = z.union([
  activitySchema.merge(socialEpisodeResponseSchema),
  activitySchema.merge(socialMovieResponseSchema),
]);
