import { z } from '../../../_internal/z.ts';

export const commentsRequestSchema = z.object({
  include_replies: z.enum(['true', 'false', 'only']).optional(),
});
