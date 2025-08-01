import { z } from '../../../_internal/z.ts';

export const minimalParamSchema = z.object({
  extended: z.literal('min'),
});
