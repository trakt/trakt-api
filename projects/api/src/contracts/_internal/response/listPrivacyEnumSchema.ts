import { asString, z } from '../z.ts';

/** Zod schema for list privacy enum. */
export const listPrivacyEnumSchema = asString(z.enum([
  'private',
  'public',
  'friends',
  'link',
]));
