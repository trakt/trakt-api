import { z } from '../../../_internal/z.ts';

/** Zod schema for token base. */
export const tokenBaseSchema = z.object({
  client_id: z.string({
    description: `The client ID of the application. 
            You can find it in the application details here: https://app.trakt.tv/settings/apps`,
  }),
  client_secret: z.string({
    description: `The client secret of the application. 
            You can find it in the application details here: https://app.trakt.tv/settings/apps`,
  }),
  redirect_uri: z.string({
    description: 'URI specified in your app settings.',
  }),
});
