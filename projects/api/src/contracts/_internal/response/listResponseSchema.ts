import { sortEnumSchema } from '../../users/_internal/request/sortParamsSchema.ts';
import { asString, z } from '../z.ts';
import { profileResponseSchema } from './profileResponseSchema.ts';
import { sortDirectionSchema } from './sortDirectionSchema.ts';

export const listResponseSchema = z.object({
  name: z.string(),
  description: z.string(),
  privacy: asString(z.enum([
    'public',
    'private',
  ])),
  share_link: z.string(),
  type: asString(z.enum([
    'all',
    'personal',
    'official',
    'watchlist',
    'favorites',
  ])),
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
});
