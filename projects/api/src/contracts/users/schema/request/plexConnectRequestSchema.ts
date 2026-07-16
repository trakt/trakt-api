import { z } from '../../../_internal/z.ts';

/** Zod schema for the plex connect request. */
export const plexConnectRequestSchema = z.object({
  return_url: z.string().openapi({
    description:
      'Where to return the user once the Plex web-auth flow completes. Must be a trakt-owned destination (`trakt://…`, `http(s)://localhost`, or `https://*.trakt.tv`); the flow appends `?plex_status=connected|error`.',
  }),
});
