import { episodeIdsResponseSchema } from '../../../_internal/response/episodeIdsResponseSchema.ts';
import { showIdsResponseSchema } from '../../../_internal/response/showIdsResponseSchema.ts';
import { int64, z } from '../../../_internal/z.ts';

export const showCheckinResponseSchema = z.object({
  id: int64(z.number().int()),
  watched_at: z.string().datetime(),
  sharing: z.object({
    twitter: z.boolean(),
    mastodon: z.boolean(),
    tumblr: z.boolean(),
  }),
  episode: z.object({
    season: z.number().int(),
    number: z.number().int(),
    title: z.string(),
    ids: episodeIdsResponseSchema,
  }),
  show: z.object({
    title: z.string(),
    year: z.number().int(),
    ids: showIdsResponseSchema,
  }),
});
