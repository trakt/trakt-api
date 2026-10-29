import { z } from '../../../_internal/z.ts';

/** Zod schema for the refresh parameters. */
export const refreshParamsSchema = z.object({
  service_id: z.string().openapi({
    description: 'The streaming service id to re-sync (e.g. `netflix`).',
  }),
  all_data: z.enum(['true', 'false']).openapi({
    description:
      '`true` forces a full re-sync of all data, `false` an incremental one.',
  }),
});
