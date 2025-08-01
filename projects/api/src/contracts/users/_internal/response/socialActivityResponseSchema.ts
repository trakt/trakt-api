import { z } from 'zod';
import { typedEpisodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { typedMovieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { asString } from '../../../_internal/z.ts';

const actionSchema = asString(z.enum(['scrobble', 'watch', 'checkin']));

const activitySchema = z.object({
  id: z.number().int(),
  activity_at: z.string().datetime(),
  action: actionSchema,
  user: profileResponseSchema,
});

export const socialActivityResponseSchema = z.discriminatedUnion('type', [
  activitySchema.merge(typedEpisodeResponseSchema),
  activitySchema.merge(typedMovieResponseSchema),
]);
