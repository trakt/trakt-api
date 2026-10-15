import { asString, z } from '../z.ts';

/** Zod schema for the show ending response. */
export const showEndingResponseSchema = asString(z.enum([
  'concluded',
  'open',
]));
