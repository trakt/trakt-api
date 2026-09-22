import { z } from '../../../_internal/z.ts';
import { commentGifParamsSchema } from './commentGifParamsSchema.ts';

/** Zod schema for the comment reply parameters. */
export const commentReplyParamsSchema = z.object({
  comment: z.string(),
  spoiler: z.boolean(),
  gif: commentGifParamsSchema.nullish(),
});
