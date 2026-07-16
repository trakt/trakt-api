import { z } from '../z.ts';

/** Zod schema for the episode stats response. */
export const episodeStatsResponseSchema = z.object({
  watchers: z.number().int(),
  plays: z.number().int(),
  collectors: z.number().int(),
  comments: z.number().int(),
  lists: z.number().int(),
  votes: z.number().int(),
});
