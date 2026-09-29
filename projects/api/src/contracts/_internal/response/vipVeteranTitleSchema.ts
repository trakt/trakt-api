import { asString, z } from '../z.ts';

/** Zod schema for the VIP veteran title enum. */
export const vipVeteranTitleSchema = asString(z.enum([
  'veteran',
  'legend',
]));
