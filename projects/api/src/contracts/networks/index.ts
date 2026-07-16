import { builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';

/** Zod schema for the network response. */
export const networkResponseSchema = z.object({
  name: z.string(),
  country: z.string().nullable().optional(),
});

/** ts-rest contract for the `networks` endpoints. */
export const networks = builder.router({
  list: {
    summary: 'Get networks',
    description: 'Get a list of all TV networks, including names.',
    path: '',
    method: 'GET',
    responses: {
      200: networkResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/networks',
});

/** The network response payload. */
export type NetworkResponse = z.infer<typeof networkResponseSchema>;
