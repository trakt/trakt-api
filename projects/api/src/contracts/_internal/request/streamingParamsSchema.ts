import { z } from '../z.ts';

export const streamingParamsSchema = z.object({
  watchnow: z.literal('favorites').optional(),
});
