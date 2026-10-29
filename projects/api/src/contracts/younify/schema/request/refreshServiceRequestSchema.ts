import { z } from '../../../_internal/z.ts';
import { refreshRequestSchema } from './refreshRequestSchema.ts';

/** Zod schema for the refresh request that names the service in the body. */
export const refreshServiceRequestSchema = refreshRequestSchema.extend({
  service_id: z.string().openapi({
    description: 'The streaming service to re-sync (e.g. `netflix`).',
  }),
});
