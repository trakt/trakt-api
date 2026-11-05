import { z } from '../z.ts';

const keywordSchema = z.enum(['released', 'unknown', 'now']);
const datetimeSchema = z.string().datetime();

/**
 * Zod schema for an action date: a UTC datetime, or one of the keywords
 * `released`, `unknown` and `now`. A refined string, not a union, so OpenAPI
 * emits a single `string` instead of an ambiguous `oneOf`.
 */
export const actionDateSchema = z
  .string()
  .refine(
    (value) =>
      keywordSchema.safeParse(value).success ||
      datetimeSchema.safeParse(value).success,
    { message: 'Expected a UTC datetime, released, unknown or now' },
  );
