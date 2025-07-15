import { asString, z } from '../z.ts';

export const listPrivacyEnumSchema = asString(z.enum([
  'private',
  'public',
  'friends',
  'link',
]));
