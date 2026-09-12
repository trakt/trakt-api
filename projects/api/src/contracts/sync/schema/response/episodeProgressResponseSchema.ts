import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { playbackItemResponseSchema } from './playbackItemResponseSchema.ts';

/** Zod schema for the episode progress response. */
export const episodeProgressResponseSchema = playbackItemResponseSchema.extend({
  type: z.literal('episode'),
  episode: episodeResponseSchema,
  show: showResponseSchema,
});
