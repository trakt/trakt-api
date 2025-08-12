import { z } from '../../../_internal/z.ts';
import { tokenBaseSchema } from './tokenBaseSchema.ts';

export const tokenRefreshSchema = tokenBaseSchema.extend({
  refresh_token: z.string({
    description:
      'The refresh token which was sent from the server during the exchange of the code.',
  }),
  grant_type: z.string({
    description:
      'Defines how an access token is obtained.',
  }),
});
