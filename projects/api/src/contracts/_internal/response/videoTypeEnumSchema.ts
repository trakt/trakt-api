import { asString, z } from '../z.ts';

export const videoTypeEnumSchema = asString(z.enum([
  'trailer',
  'clip',
  'teaser',
  'featurette',
  'recap',
  'behind the scenes',
  'opening credits',
]));
