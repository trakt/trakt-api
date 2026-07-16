import { z } from '../z.ts';

/** Zod schema for the id parameters. */
export const idParamsSchema = z.object({
  id: z.string().openapi({
    description: 'The slug of the resource.',
  }),
});
