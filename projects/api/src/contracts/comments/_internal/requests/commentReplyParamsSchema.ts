import { z } from '../../../_internal/z.ts';

export const commentReplyParamsSchema = z.object({
  comment: z.string(),
  spoiler: z.boolean(),
});
