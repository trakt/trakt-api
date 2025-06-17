import { z } from '../z.ts';

export const streamingIdsResponseSchema = z.object({
  guid: z.string().nullish(),
  slug: z.string().nullish(),
});
