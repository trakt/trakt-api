import { z } from '../../../_internal/z.ts';
import { tokenBaseSchema } from './tokenBaseSchema.ts';

export const tokenRequestSchema = tokenBaseSchema.extend({
  code: z.string({
    description:
      'The code received when trakt redirects the user back to the application.',
  }),
  grant_type: z.string({
    description:
      'Defines how an access token is obtained.',
  }),
});
