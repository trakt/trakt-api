import { z } from '../../../_internal/z.ts';
import { hiddenSectionSchema } from './hiddenSectionSchema.ts';

/** Zod schema for the hidden parameters. */
export const hiddenParamsSchema = z.object({
  section: hiddenSectionSchema,
});
