import { z } from '../../../_internal/z.ts';

/** Zod schema for the token exchange error response. */
export const tokenErrorResponseSchema = z.object({
  error: z.string({
    description: 'OAuth error code, such as `invalid_grant`.',
  }),
  error_description: z.string({
    description: 'Human-readable details about the token exchange failure.',
  }),
}).describe('Bad Request - the token exchange could not be completed.');
