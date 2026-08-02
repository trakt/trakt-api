import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for a global leaderboard entry. */
export const globalLeaderboardEntryResponseSchema = z.object({
  rank: z.number().int(),
  user: profileResponseSchema,
  total_minutes: z.number().int(),
  total_plays: z.number().int(),
});
