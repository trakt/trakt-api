import { z } from '../../../_internal/z.ts';

export const plexErrorResponseSchema = z.object({
  error_code: z.string().openapi({
    description:
      'Machine-readable error code (e.g. `bad_auth`, `invalid_server_url`, `plex_timeout`).',
  }),
  message: z.string(),
  guidance: z.string(),
});
