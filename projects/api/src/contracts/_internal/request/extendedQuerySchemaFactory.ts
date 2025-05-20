import type { CombinationsFrom } from '../../../types/CombinationsFrom.ts';
import { z } from '../z.ts';

export const extendedQuerySchemaFactory = <T extends string[]>() =>
  z.object({
    extended: z
      .custom<CombinationsFrom<T>>()
      .optional()
      .openapi({
        description: 'Extended information to include in the response.',
      }),
  });
