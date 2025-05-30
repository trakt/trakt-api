import { z } from '../z.ts';

export const showCertificationResponseSchema = z.enum([
  'TV-14',
  'TV-Y7',
  'TV-Y',
  'NR',
  'TV-PG',
  'TV-MA',
  'TV-G',
  'G',
  'PG-13',
  'NC-17',
  'R',
  'PG',
]).forceString();
