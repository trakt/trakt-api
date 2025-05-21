import { z } from '../z.ts';

const sentimentResponseSchema = z.object({
  sentiment: z.string(),
  comment_ids: z.array(z.number().int()),
});

export const sentimentsResponseSchema = z.object({
  bad: sentimentResponseSchema.array(),
  good: sentimentResponseSchema.array(),
  analyzed_at: z.string().datetime(),
  comment_count: z.number().int(),
});
