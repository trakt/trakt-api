import { z } from '../../../_internal/z.ts';

/** Zod schema for the comments request. */
export const commentsRequestSchema = z.object({
  include_replies: z.enum(['true', 'false', 'only']).nullish(),
});
