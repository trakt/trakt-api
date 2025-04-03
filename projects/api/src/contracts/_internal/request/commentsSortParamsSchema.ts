import { z } from '../z.ts';

export const commentsSortParamsSchema = z.object({
  sort: z.enum([
    'newest',
    'oldest',
    'likes',
    'replies',
    'highest',
    'lowest',
    'plays',
  ]).optional(),
});
