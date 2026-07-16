import { z } from '../../../_internal/z.ts';

/** Zod schema for the code request. */
export const codeRequestSchema = z.object({
  client_id: z.string().openapi({
    description: `The client ID of the application. 
            You can find it in the application details here: https://trakt.tv/oauth/applications`,
  }),
});
