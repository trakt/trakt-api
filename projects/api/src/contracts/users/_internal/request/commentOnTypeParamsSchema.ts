import { z } from '../../../_internal/z.ts';

export const commentOnTypeParamsSchema = z.object({
  type: z.enum([
    'all',
    'movies',
    'shows',
    'seasons',
    'episodes',
    'lists',
  ]),
});
