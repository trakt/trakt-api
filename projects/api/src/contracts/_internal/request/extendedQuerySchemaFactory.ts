import type { CombinationsFrom } from '../../../types/CombinationsFrom.ts';
import { z } from '../z.ts';

export const extendedQuerySchemaFactory = <T extends string[]>(): z.ZodObject<{
  extended: z.ZodOptional<z.ZodNullable<z.ZodType<CombinationsFrom<T>>>>;
}> =>
  z.object({
    extended: z
      .custom<CombinationsFrom<T>>()
      .nullish()
      .openapi({
        description: 'Extended information to include in the response.',
      }),
  });
