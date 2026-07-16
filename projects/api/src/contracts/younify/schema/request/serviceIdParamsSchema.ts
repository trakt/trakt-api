import { z } from '../../../_internal/z.ts';

/** Zod schema for the service id parameters. */
export const serviceIdParamsSchema = z.object({
  service_id: z.string().openapi({
    description: 'The streaming service id (e.g. `netflix`).',
  }),
});
