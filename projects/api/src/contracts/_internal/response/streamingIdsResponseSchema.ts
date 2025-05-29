import { z } from '../z.ts';

export const streamingIdsResponseSchema = z.object({
  guid: z.string(),
  slug: z.string().optional(),
});
