import { listPrivacyEnumSchema } from '../../../_internal/response/listPrivacyEnumSchema.ts';
import { z } from '../../../_internal/z.ts';

export const listUpdateRequestSchema = z.object({
  name: z.string().nullish(),
  description: z.string().nullish(),
  privacy: listPrivacyEnumSchema.nullish(),
  display_numbers: z.boolean().nullish(),
  allow_comments: z.boolean().nullish(),
});
