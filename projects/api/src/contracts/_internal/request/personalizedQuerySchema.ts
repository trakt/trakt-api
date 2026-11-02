import { z } from '../z.ts';

/** Zod schema for the personalized related query parameter. */
export const personalizedQuerySchema = z.object({
  personalized: z.boolean().optional().openapi({
    description:
      'When true, VIP and director accounts get the same related titles re-ordered toward their taste. Ignored for everyone else.',
  }),
});
