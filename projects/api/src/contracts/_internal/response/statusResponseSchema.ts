import { z } from '../z.ts';

export const statusResponseSchema = z.enum([
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
]).forceString();
