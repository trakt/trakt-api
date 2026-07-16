import { z } from '../../../_internal/z.ts';

/** Zod schema for the comment reply parameters. */
export const commentReplyParamsSchema = z.object({
  comment: z.string(),
  spoiler: z.boolean(),
});
