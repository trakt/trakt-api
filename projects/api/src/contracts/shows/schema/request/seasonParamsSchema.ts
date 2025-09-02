import { z } from '../../../_internal/z.ts';

export const seasonParamsSchema = z.object({
  season: z.number().int().nonnegative().openapi({
    description: 'Season number',
  }),
});
