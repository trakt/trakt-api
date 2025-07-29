import { z } from '../z.ts';
import { profileResponseSchema } from './profileResponseSchema.ts';

export const reactionEnumSchema = z.enum([
  'like',
  'dislike',
  'love',
  'laugh',
  'shocked',
  'bravo',
  'spoiler',
]);

export const reactionsSummaryResponseSchema = z.object({
  reaction_count: z.number().int(),
  user_count: z.number().int(),
  distribution: z.record(reactionEnumSchema, z.number().int()),
});

export const reactionsResponseSchema = z.object({
  reacted_at: z.string().datetime(),
  reaction: z.object({
    type: reactionEnumSchema,
  }),
  user: profileResponseSchema,
});

export const reactionTypeSchema = z.object({
  reaction_type: reactionEnumSchema,
});
