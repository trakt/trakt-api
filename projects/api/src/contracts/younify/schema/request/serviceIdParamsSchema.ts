import { z } from '../../../_internal/z.ts';

export const serviceIdParamsSchema = z.object({
  service_id: z.string().openapi({
    description: 'The streaming service id (e.g. `netflix`).',
  }),
});
