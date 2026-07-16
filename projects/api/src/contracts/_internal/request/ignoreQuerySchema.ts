import { z } from '../z.ts';

/** Zod schema for the ignore query parameters. */
export const ignoreQuerySchema = z.object({
  ignore_watched: z.boolean().nullish().openapi({
    description: 'Ignore watched items.',
  }),
  ignore_collected: z.boolean().nullish().openapi({
    description: 'Ignore collected items.',
  }),
  ignore_watchlisted: z.boolean().nullish().openapi({
    description: 'Ignore watchlisted items.',
  }),
});
