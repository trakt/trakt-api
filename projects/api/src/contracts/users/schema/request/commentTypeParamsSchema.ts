import { z } from '../../../_internal/z.ts';

export const commentTypeParamsSchema = z.object({
  comment_type: z.enum(['all', 'reviews', 'shouts']),
});
