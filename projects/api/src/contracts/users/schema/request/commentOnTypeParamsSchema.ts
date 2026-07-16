import { z } from '../../../_internal/z.ts';

/** Zod schema for the comment on type parameters. */
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
