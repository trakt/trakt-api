import { extendedMediaQuerySchema } from '../../../_internal/request/extendedMediaQuerySchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the year and month in review query parameters. */
export const reviewQuerySchema = extendedMediaQuerySchema.merge(
  z.object({
    slurm: z.string().optional().openapi({
      description:
        "A user's VIP feed token. Stands in for the viewer when the request has no Authorization header.",
    }),
  }),
);
