import { z } from '../../../_internal/z.ts';
import { hiddenSectionSchema } from './hiddenSectionSchema.ts';

export const hiddenParamsSchema = z.object({
  section: hiddenSectionSchema,
});
