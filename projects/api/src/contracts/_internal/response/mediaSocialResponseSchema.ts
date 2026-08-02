import { profileResponseSchema } from './profileResponseSchema.ts';
import { z } from '../z.ts';

/**
 * A followed user's activity on a single media item. `watched` is present once
 * the user has plays, and carries their `rating` and `comment` when they left
 * either; `watchlisted` is present while the item sits on their watchlist.
 */
export const mediaSocialResponseSchema = z.object({
  followed_at: z.string().datetime().nullish(),
  user: profileResponseSchema,
  watched: z.object({
    plays: z.number().int(),
    minutes_watched: z.number().int(),
    last_watched_at: z.string().datetime().nullish(),
    last_updated_at: z.string().datetime().nullish(),
    rating: z.object({
      rating: z.number().int(),
      rated_at: z.string().datetime().nullish(),
    }).nullish(),
    comment: z.object({
      ids: z.object({ trakt: z.number().int() }),
      comment: z.string().nullish(),
      spoiler: z.boolean(),
      review: z.boolean(),
      created_at: z.string().datetime().nullish(),
      updated_at: z.string().datetime().nullish(),
    }).nullish(),
  }).nullish(),
  watchlisted: z.object({
    listed_at: z.string().datetime(),
  }).nullish(),
});
