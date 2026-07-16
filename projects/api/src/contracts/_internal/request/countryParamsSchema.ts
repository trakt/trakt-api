import { z } from '../z.ts';

/** Zod schema for the country parameters. */
export const countryParamsSchema = z.object({
  country: z.string().optional().openapi({
    description: '2 character country code.',
  }),
});
