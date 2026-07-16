import { asString, z } from '../z.ts';

/** Zod schema for the crew position response. */
export const crewPositionResponseSchema = asString(z.enum([
  'acting',
  'production',
  'art',
  'crew',
  'costume & make-up',
  'directing',
  'writing',
  'sound',
  'camera',
  'lighting',
  'visual effects',
  'editing',
  'creator',
  'created by',
]));
