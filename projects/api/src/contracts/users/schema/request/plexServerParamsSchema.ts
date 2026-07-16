import { z } from '../../../_internal/z.ts';

/** Zod schema for the plex server parameters. */
export const plexServerParamsSchema = z.object({
  server_id: z.string().openapi({
    description: 'The Plex server machine identifier.',
  }),
});
