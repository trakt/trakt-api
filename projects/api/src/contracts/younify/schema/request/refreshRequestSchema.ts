import { z } from '../../../_internal/z.ts';

/** Zod schema for the refresh request. */
export const refreshRequestSchema = z.object({
  skip_sync: z.boolean().optional().openapi({
    description:
      'Only mark the service as synced now, so history from before this moment is ignored.',
  }),
});
