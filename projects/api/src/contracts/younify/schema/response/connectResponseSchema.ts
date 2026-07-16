import { z } from '../../../_internal/z.ts';

/** Zod schema for the connect response. */
export const connectResponseSchema = z.object({
  url: z.string().openapi({
    description: 'The signed younify web-auth URL for the client to open.',
  }),
});
