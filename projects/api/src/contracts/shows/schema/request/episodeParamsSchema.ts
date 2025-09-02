import { z } from '../../../_internal/z.ts';

export const episodeParamsSchema = z.object({
  episode: z.number().int().nonnegative().openapi({
    description: 'Episode number',
  }),
});
