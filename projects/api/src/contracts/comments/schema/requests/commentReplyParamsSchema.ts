import { z } from '../../../_internal/z.ts';

/** Zod schema for the comment reply parameters. */
export const commentReplyParamsSchema = z.object({
  comment: z.string(),
  spoiler: z.boolean(),
  gif: z.string().nullish(),
  gif_width: z.number().int().nullish(),
  gif_height: z.number().int().nullish(),
});
