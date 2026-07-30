import { z } from '../../../_internal/z.ts';

/** Zod schema for the device token request. */
export const deviceTokenRequestSchema = z.object({
  code: z.string({
    description:
      'The device code received from the device authorization request.',
  }),
  client_id: z.string({
    description: `The client ID of the application. 
            You can find it in the application details here: https://app.trakt.tv/settings/apps`,
  }),
  client_secret: z.string({
    description: `The client secret of the application. 
            You can find it in the application details here: https://app.trakt.tv/settings/apps`,
  }),
});
