import { z } from '../../../_internal/z.ts';
import { tokenBaseSchema } from './tokenBaseSchema.ts';

/** Zod schema for the token request. */
export const tokenRequestSchema = tokenBaseSchema.extend({
  code: z.string({
    description:
      'The code received when trakt redirects the user back to the application.',
  }),
  grant_type: z.string({
    description: 'Defines how an access token is obtained.',
  }),
  code_verifier: z.string({
    description:
      'The PKCE code verifier whose SHA-256 hash was sent as `code_challenge`. Required when the flow started with a `code_challenge`. See https://developer.trakt.tv/docs/pkce',
  }).optional(),
});
