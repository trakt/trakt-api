import { z } from '../../../_internal/z.ts';

/** Zod schema for the sync type parameters. */
export const syncTypeParamsSchema = z.object({
  type: z.enum(['younify', 'plex', 'import']).openapi({
    description:
      'Filter syncs by the app that created them. An unknown type returns `404` rather than silently returning everything.',
  }),
});
