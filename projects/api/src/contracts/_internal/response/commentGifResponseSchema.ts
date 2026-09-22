import { z } from '../z.ts';

/** Zod schema for the gif attached to a comment; 0 by 0 when the size was never sent. */
export const commentGifResponseSchema = z.object({
  url: z.string(),
  width: z.number().int(),
  height: z.number().int(),
});
