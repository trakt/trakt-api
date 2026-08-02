import { z } from '../../../_internal/z.ts';

/** Zod schema for the sync updates type path parameter. */
export const updatesTypeParamsSchema = z.object({
  type: z.enum(['movies', 'shows']).openapi({
    description: 'Media type to check for updates.',
  }),
});
