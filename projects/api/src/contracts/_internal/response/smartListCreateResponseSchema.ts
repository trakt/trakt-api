import { z } from '../z.ts';

/** Zod schema for the smart list create response. */
export const smartListCreateResponseSchema = z.object({
  ids: z.object({
    trakt: z.number().int(),
    slug: z.string(),
  }),
});
