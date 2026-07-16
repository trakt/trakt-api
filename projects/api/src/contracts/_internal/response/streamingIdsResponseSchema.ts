import { z } from '../z.ts';

/** Zod schema for the streaming ids response. */
export const streamingIdsResponseSchema = z.object({
  guid: z.string().nullish(),
  slug: z.string().nullish(),
});
