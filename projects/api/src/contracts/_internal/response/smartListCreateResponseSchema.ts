import { z } from '../z.ts';

export const smartListCreateResponseSchema = z.object({
  ids: z.object({
    trakt: z.number().int(),
    slug: z.string(),
  }),
});
