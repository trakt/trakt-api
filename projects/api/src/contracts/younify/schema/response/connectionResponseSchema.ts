import { z } from '../../../_internal/z.ts';

/** Zod schema for connection. */
export const connectionSchema = z.object({
  id: z.string().openapi({
    description: 'The streaming service id (e.g. `netflix`).',
  }),
  name: z.string(),
  vip: z.boolean().openapi({
    description:
      'Whether the service requires Trakt VIP. `false` is the free tier.',
  }),
  color: z.string(),
  images: z.object({
    logo: z.string().nullable(),
  }),
  connectable: z.boolean().openapi({
    description:
      'Whether the current user may connect this service (VIP gating). Use to show Connect vs an upsell.',
  }),
  connected: z.boolean().openapi({
    description: 'Whether the service is linked for the current user.',
  }),
  active: z.boolean().openapi({
    description: 'Whether the link is healthy. `false` means a broken link.',
  }),
  profile: z.string().nullable().openapi({
    description: 'The connected profile name, or null when not connected.',
  }),
  last_synced_at: z.string().datetime().nullable().openapi({
    description:
      'When the service last synced, normalized to `.000Z`, or null when not connected.',
  }),
});
