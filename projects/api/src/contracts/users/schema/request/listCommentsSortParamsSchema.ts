import { z } from '../../../_internal/z.ts';

/** Zod schema for the list comments sort parameters. */
export const listCommentsSortParamsSchema = z.object({
  sort: z.enum([
    'newest',
    'oldest',
    'likes',
    'replies',
  ]).nullish(),
});
