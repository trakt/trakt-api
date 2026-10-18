import { sortEnumSchema } from '../../users/schema/request/sortParamsSchema.ts';
import { asString, z } from '../z.ts';
import { listPrivacyEnumSchema } from './listPrivacyEnumSchema.ts';
import { profileResponseSchema } from './profileResponseSchema.ts';
import { smartListCreateResponseSchema } from './smartListCreateResponseSchema.ts';
import { sortDirectionSchema } from './sortDirectionSchema.ts';

/** Zod schema for the list response. */
export const listResponseSchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
  privacy: listPrivacyEnumSchema,
  share_link: z.string(),
  type: asString(
    z.enum(['all', 'personal', 'official', 'watchlist', 'favorites']),
  ),
  display_numbers: z.boolean(),
  allow_comments: z.boolean(),
  sort_by: sortEnumSchema,
  sort_how: sortDirectionSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  item_count: z.number().int(),
  comment_count: z.number().int(),
  likes: z.number().int(),
  ids: z.object({
    trakt: z.number().int(),
    slug: z.string(),
  }),
  user: profileResponseSchema,
  /***
   * Set for the list owner when the tool that kept this list updated stopped
   * syncing it. `null` otherwise, and for every other viewer.
   */
  stale_origin: z
    .object({
      name: z.string(),
      url: z.string().nullable(),
    })
    .nullish(),
  /***
   * Set once the owner turned this list into a smart list. Visible to
   * everyone when that smart list is public, and always to the owner.
   */
  converted_to: smartListCreateResponseSchema.nullish(),
  /***
   * Available if requesting extended `images`.
   */
  images: z
    .object({
      posters: z.array(z.string()),
    })
    .nullish(),
});
