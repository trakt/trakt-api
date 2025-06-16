import { z } from '../../../_internal/z.ts';

export const listUpdateRequestSchema = z.object({
  name: z.string().nullish(),
  description: z.string().nullish(),
  privacy: z.enum(['private', 'link', 'friends', 'public']).nullish(),
  display_numbers: z.boolean().nullish(),
  allow_comments: z.boolean().nullish(),
});
