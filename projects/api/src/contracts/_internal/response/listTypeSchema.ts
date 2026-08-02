import { z } from '../z.ts';

/** Zod schema for the list type filter. */
export const listTypeSchema = z.object({
  type: z.enum([
    'all',
    'personal',
    'official',
    'watchlists',
    'recommendations',
  ]),
});
