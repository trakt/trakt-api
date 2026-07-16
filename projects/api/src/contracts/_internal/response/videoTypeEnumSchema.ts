import { asString, z } from '../z.ts';

/** Zod schema for video type enum. */
export const videoTypeEnumSchema = asString(z.enum([
  'trailer',
  'clip',
  'teaser',
  'featurette',
  'recap',
  'behind the scenes',
  'opening credits',
  'bloopers',
]));
