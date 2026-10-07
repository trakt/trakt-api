import { z } from '../z.ts';

/** Zod schema for the gif attached to a comment. */
export const commentGifResponseSchema = z.object({
  url: z.string(),
  slug: z.string().nullish(),
});
