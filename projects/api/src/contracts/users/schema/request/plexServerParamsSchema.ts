import { z } from '../../../_internal/z.ts';

export const plexServerParamsSchema = z.object({
  server_id: z.string().openapi({
    description: 'The Plex server machine identifier.',
  }),
});
