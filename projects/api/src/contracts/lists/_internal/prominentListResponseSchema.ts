import { listResponseSchema } from '../../_internal/response/listResponseSchema.ts';
import { z } from '../../_internal/z.ts';

export const prominentListResponseSchema = z.object({
  like_count: z.number(),
  comment_count: z.number(),
  list: listResponseSchema,
});
