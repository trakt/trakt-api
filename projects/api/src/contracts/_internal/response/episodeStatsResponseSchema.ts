import { z } from '../z.ts';

export const episodeStatsResponseSchema = z.object({
  watchers: z.number().int(),
  plays: z.number().int(),
  collectors: z.number().int(),
  comments: z.number().int(),
  lists: z.number().int(),
  votes: z.number().int(),
});
