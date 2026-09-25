import { z } from '../z.ts';

/** Zod schema for the free-text `terms` query parameter. */
export const termsQuerySchema = z.object({
  terms: z.string().nullish().openapi({
    description:
      'Only return entries whose name contains this text (case-insensitive).',
  }),
});
