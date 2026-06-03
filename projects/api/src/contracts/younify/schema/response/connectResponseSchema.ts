import { z } from '../../../_internal/z.ts';

export const connectResponseSchema = z.object({
  url: z.string().openapi({
    description: 'The signed younify web-auth URL for the client to open.',
  }),
});
