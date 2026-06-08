import { z } from '../../../_internal/z.ts';

export const plexConnectResponseSchema = z.object({
  url: z.string().openapi({
    description: 'The Plex web-auth URL for the client to open.',
  }),
});
