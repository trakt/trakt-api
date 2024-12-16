import { z } from '../z.ts';

export const mediaStatsResponseSchema = z.object({
  watchers: z.number(),
  plays: z.number(),
  collectors: z.number(),
  comments: z.number(),
  lists: z.number(),
  votes: z.number(),
  favorited: z.number(),
});
