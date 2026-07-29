import { z } from '../../../_internal/z.ts';
import { tokenBaseSchema } from './tokenBaseSchema.ts';

/** Zod schema for token refresh. */
export const tokenRefreshSchema = tokenBaseSchema.extend({
  refresh_token: z.string({
    description:
      'The current refresh token. Refresh tokens are single-use; after a successful exchange, replace it with the new `refresh_token` returned in the response.',
  }),
  grant_type: z.string({
    description: 'Defines how an access token is obtained.',
  }),
});
