import { z } from '../z.ts';

export const ignoreQuerySchema = z.object({
  ignore_watched: z.boolean().optional().openapi({
    description: 'Ignore watched items.',
  }),
  ignore_collected: z.boolean().optional().openapi({
    description: 'Ignore collected items.',
  }),
  ignore_watchlisted: z.boolean().optional().openapi({
    description: 'Ignore watchlisted items.',
  }),
});
