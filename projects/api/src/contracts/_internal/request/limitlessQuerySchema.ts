import { z } from '../z.ts';

/** Zod schema for the limitless query parameters. */
export const limitlessQuerySchema = z.object({
  limit: z.number()
    .int()
    .or(z.literal('all'))
    .nullish()
    .openapi({
      description:
        `The number of items per page, can be a number or the value all`,
      type: 'string',
      oneOf: undefined,
    }),
});
