import { z } from '../z.ts';

export const movieCertificationResponseSchema = z.enum([
  // In the data, there are entries with the value 'undefined'
  'undefined',

  'Dark',
  'G',
  'NC-17',
  'NR',
  'PG',
  'PG-13',
  'R',
  'TVMA',
  'Unrated',
  'X',
  'Young',
]).forceString();
