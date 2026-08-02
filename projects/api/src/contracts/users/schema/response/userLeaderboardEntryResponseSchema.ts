import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/**
 * Zod schema for a viewer-follows leaderboard entry. Adds `locked` over
 * {@link globalLeaderboardEntryResponseSchema}: once the ranked (VIP)
 * segment is exhausted, remaining free follows are returned with
 * `rank`/`total_minutes`/`total_plays` null and `locked: true`.
 */
export const userLeaderboardEntryResponseSchema = z.object({
  rank: z.number().int().nullable(),
  user: profileResponseSchema,
  total_minutes: z.number().int().nullable(),
  total_plays: z.number().int().nullable(),
  locked: z.boolean(),
});
