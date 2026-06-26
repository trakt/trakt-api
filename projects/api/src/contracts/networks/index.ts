import { builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';

export const networkResponseSchema = z.object({
  name: z.string(),
  country: z.string().nullable().optional(),
});

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

export type NetworkResponse = z.infer<typeof networkResponseSchema>;
