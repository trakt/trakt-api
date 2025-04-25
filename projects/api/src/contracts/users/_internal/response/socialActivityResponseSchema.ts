import { z } from 'zod';
import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';

const actionSchema = z.enum(['scrobble', 'watch', 'checkin']);

export const socialActivityResponseSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.number(),
    activity_at: z.string(),
    action: actionSchema,
    type: z.literal('episode'),
    episode: episodeResponseSchema,
    show: showResponseSchema,
    user: profileResponseSchema,
  }),
  z.object({
    id: z.number(),
    activity_at: z.string(),
    action: actionSchema,
    type: z.literal('movie'),
    movie: movieResponseSchema,
    user: profileResponseSchema,
  }),
]);
