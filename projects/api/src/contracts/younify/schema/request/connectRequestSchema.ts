import { z } from '../../../_internal/z.ts';

export const connectRequestSchema = z.object({
  service_id: z.string().openapi({
    description: 'The streaming service to connect (e.g. `netflix`).',
  }),
  return_url: z.string().openapi({
    description:
      'Where the younify web-auth flow returns the user once complete. Must be a trakt-owned destination (`trakt://…` or `https://*.trakt.tv`).',
  }),
});
