import type { CombinationsFrom } from '../../../../types/CombinationsFrom.ts';
import { z } from '../../../_internal/z.ts';

export const searchTypeParamFactory = <T extends string[]>() =>
  z.object({
    type: z
      .custom<CombinationsFrom<T>>()
      .nullish()
      .openapi({
        description:
          'Specify the type of results by sending a single value or a comma delimited string for multiple types.',
        enum: ['movie', 'show'],
      }),
  });
