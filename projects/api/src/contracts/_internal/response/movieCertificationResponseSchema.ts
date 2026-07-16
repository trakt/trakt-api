import { asString, z } from '../z.ts';

/** Zod schema for the movie certification response. */
export const movieCertificationResponseSchema = asString(z.enum([
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
]));
