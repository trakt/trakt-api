import { z } from '../z.ts';

/** Zod schema for list sort. */
export const listSortSchema = z.object({
  sort: z.enum([
    'popular',
    'likes',
    'comments',
    'items',
    'added',
    'updated',
  ]),
});
