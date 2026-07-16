import { z } from '../../../_internal/z.ts';

/** Zod schema for the comment type parameters. */
export const commentTypeParamsSchema = z.object({
  comment_type: z.enum(['all', 'reviews', 'shouts']),
});
