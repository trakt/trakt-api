import type { CombinationsFrom } from '../../../../types/CombinationsFrom.ts';
import { z } from '../../../_internal/z.ts';

/** Search type param factory. */
export const searchTypeParamFactory = <
  const T extends string[],
>(types: T): z.ZodObject<{
  type: z.ZodOptional<z.ZodNullable<z.ZodType<CombinationsFrom<T>>>>;
}> =>
  z.object({
    type: z
      .custom<CombinationsFrom<T>>()
      .nullish()
      .openapi({
        description:
          'Specify the type of results by sending a single value or a comma delimited string for multiple types.',
        enum: types,
      }),
  });
