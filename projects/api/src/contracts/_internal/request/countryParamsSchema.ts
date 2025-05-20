import { z } from '../z.ts';

export const countryParamsSchema = z.object({
  country: z.string().openapi({
    description: '2 character country code.',
  }),
});
