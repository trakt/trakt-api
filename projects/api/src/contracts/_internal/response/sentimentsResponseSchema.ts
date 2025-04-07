import { z } from '../z.ts';

const sentimentResponseSchema = z.object({
  sentiment: z.string(),
  comment_ids: z.array(z.number()),
});

export const sentimentsResponseSchema = z.object({
  bad: sentimentResponseSchema.array(),
  good: sentimentResponseSchema.array(),
  analyzed_at: z.string(),
  comment_count: z.number(),
});
