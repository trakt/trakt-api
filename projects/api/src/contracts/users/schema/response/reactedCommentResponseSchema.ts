import { commentResponseSchema } from '../../../_internal/response/commentResponseSchema.ts';
import { reactionEnumSchema } from '../../../_internal/response/reactionsResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the reacted comment response. */
export const reactedCommentResponseSchema = z.object({
  reacted_at: z.string().datetime(),
  reaction: z.object({
    type: reactionEnumSchema,
  }),
  type: z.literal('comment'),
  /***
   * When using extended 'min', only the id is returned
   */
  comment: commentResponseSchema.partial()
    .extend({ id: z.number().int() }),
});
