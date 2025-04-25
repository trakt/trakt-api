import { sortEnumSchema } from '../../users/_internal/request/sortParamsSchema.ts';
import { z } from '../z.ts';
import { profileResponseSchema } from './profileResponseSchema.ts';
import { sortDirectionSchema } from './sortDirectionSchema.ts';

export const listResponseSchema = z.object({
  name: z.string(),
  description: z.string(),
  privacy: z.enum([
    'public',
    'private',
  ]),
  share_link: z.string(),
  type: z.enum([
    'all',
    'personal',
    'official',
    'watchlist',
    'favorites',
  ]),
  display_numbers: z.boolean(),
  allow_comments: z.boolean(),
  sort_by: sortEnumSchema,
  sort_how: sortDirectionSchema,
  created_at: z.string(),
  updated_at: z.string(),
  item_count: z.number(),
  comment_count: z.number(),
  likes: z.number(),
  ids: z.object({
    trakt: z.number(),
    slug: z.string(),
  }),
  user: profileResponseSchema,
});
