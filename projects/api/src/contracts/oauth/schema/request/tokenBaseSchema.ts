import { z } from '../../../_internal/z.ts';
import { clientSecretSchema } from './clientSecretSchema.ts';

/** Zod schema for token base. */
export const tokenBaseSchema = z.object({
  client_id: z.string({
    description: `The client ID of the application. 
            You can find it in the application details here: https://app.trakt.tv/settings/apps`,
  }),
  client_secret: clientSecretSchema,
  redirect_uri: z.string({
    description: 'URI specified in your app settings.',
  }),
});
