import { z } from '../../../_internal/z.ts';

export const listCommentsSortParamsSchema = z.object({
  sort: z.enum([
    'newest',
    'oldest',
    'likes',
    'replies',
  ]).nullish(),
});
