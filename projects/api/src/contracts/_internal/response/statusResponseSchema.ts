import { asString, z } from '../z.ts';

/** Zod schema for the status response. */
export const statusResponseSchema = asString(z.enum([
  'released',
  'planned',
  'post production',
  'canceled',
  'in production',
  'rumored',
  'ended',
  'returning series',
  'pilot',
  'continuing',
  'upcoming',
]));
