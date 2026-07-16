import { movieIdsResponseSchema } from '../../../_internal/response/movieIdsResponseSchema.ts';
import { int64, z } from '../../../_internal/z.ts';

/** Zod schema for the movie checkin response. */
export const movieCheckinResponseSchema = z.object({
  id: int64(z.number().int()),
  watched_at: z.string().datetime(),
  sharing: z.object({
    twitter: z.boolean().nullish(),
    mastodon: z.boolean().nullish(),
    tumblr: z.boolean().nullish(),
  }),
  movie: z.object({
    title: z.string(),
    year: z.number().int(),
    ids: movieIdsResponseSchema,
  }).nullish(),
});
