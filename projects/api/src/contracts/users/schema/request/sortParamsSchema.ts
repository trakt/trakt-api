import { asString, z } from '../../../_internal/z.ts';

// FIXME: add vip-only sort options
/** Zod schema for sort enum. */
export const sortEnumSchema = asString(z.enum([
  'rank',
  'added',
  'title',
  'released',
  'runtime',
  'popularity',
  'percentage',
  'votes',
]));

// FIXME split up param & response schemas
/** Zod schema for the sort parameters. */
export const sortParamsSchema = z.object({
  sort: sortEnumSchema,
}).openapi({
  description: 'How to sort',
});
