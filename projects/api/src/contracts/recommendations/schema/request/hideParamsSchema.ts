import { z } from '../../../_internal/z.ts';

/** Zod schema for the hide parameters. */
export const hideParamsSchema = z.object({
  id: z.number().int().or(z.string()).describe(
    'Trakt ID, Trakt slug, or IMDB ID Example: 922.',
  ),
});
