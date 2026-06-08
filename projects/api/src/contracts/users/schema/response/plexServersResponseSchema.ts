import { z } from '../../../_internal/z.ts';

export const plexServerSchema = z.object({
  id: z.string(),
  name: z.string(),
  connection_count: z.number().int(),
  connection_timeout: z.number().int().openapi({
    description:
      'Worst-case probe timeout across the server connections, in seconds.',
  }),
  ports: z.number().int().array(),
  owned: z.boolean(),
  url: z.string().nullable().openapi({
    description:
      'The resolved remote URL, or null when the server is unreachable.',
  }),
});

export const plexServersResponseSchema = z.object({
  servers: plexServerSchema.array(),
});
