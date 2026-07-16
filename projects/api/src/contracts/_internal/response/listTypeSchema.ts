import { z } from '../z.ts';

/** Zod schema for list type. */
export const listTypeSchema = z.object({
  type: z.enum([
    'all',
    'personal',
    'official',
    'watchlist',
    'favorites',
  ]),
});
