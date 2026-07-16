import { z } from '../z.ts';

/** Zod schema for the comments sort parameters. */
export const commentsSortParamsSchema = z.object({
  sort: z.enum([
    'newest',
    'oldest',
    'likes',
    'replies',
    'highest',
    'lowest',
    'plays',
  ]).nullish(),
});
