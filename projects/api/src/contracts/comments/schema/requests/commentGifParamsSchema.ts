import { z } from '../../../_internal/z.ts';

/** Zod schema for the gif attached to a comment or reply. */
export const commentGifParamsSchema = z.object({
  url: z.string(),
  slug: z.string().nullish(),
});
