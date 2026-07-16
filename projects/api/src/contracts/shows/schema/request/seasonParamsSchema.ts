import { z } from '../../../_internal/z.ts';

/** Zod schema for the season parameters. */
export const seasonParamsSchema = z.object({
  season: z.number().int().nonnegative().openapi({
    description: 'Season number',
  }),
});
