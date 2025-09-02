import { listPrivacyEnumSchema } from '../../../_internal/response/listPrivacyEnumSchema.ts';
import { sortDirectionSchema } from '../../../_internal/response/sortDirectionSchema.ts';
import { z } from '../../../_internal/z.ts';
import { sortEnumSchema } from './sortParamsSchema.ts';

export const createListRequestSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  privacy: listPrivacyEnumSchema.optional(),
  display_numbers: z.boolean().optional(),
  allow_comments: z.boolean().optional(),
  sort_by: sortEnumSchema.optional(),
  sort_how: sortDirectionSchema.optional(),
});
