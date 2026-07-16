import { z } from '../z.ts';
import { profileResponseSchema } from './profileResponseSchema.ts';

/** Zod schema for reaction enum. */
export const reactionEnumSchema = z.enum([
  'like',
  'dislike',
  'love',
  'laugh',
  'shocked',
  'bravo',
  'spoiler',
]);

/** Zod schema for the reactions summary response. */
export const reactionsSummaryResponseSchema = z.object({
  reaction_count: z.number().int(),
  user_count: z.number().int(),
  distribution: z.record(reactionEnumSchema, z.number().int()),
});

/** Zod schema for the reactions response. */
export const reactionsResponseSchema = z.object({
  reacted_at: z.string().datetime(),
  reaction: z.object({
    type: reactionEnumSchema,
  }),
  user: profileResponseSchema,
});

/** Zod schema for reaction type. */
export const reactionTypeSchema = z.object({
  reaction_type: reactionEnumSchema,
});
