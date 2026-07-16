import { z } from '../../../_internal/z.ts';

/** Zod schema for the episode parameters. */
export const episodeParamsSchema = z.object({
  episode: z.number().int().nonnegative().openapi({
    description: 'Episode number',
  }),
});
