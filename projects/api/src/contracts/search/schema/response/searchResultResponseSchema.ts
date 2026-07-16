import { z } from '../../../_internal/z.ts';
import { searchListResponseSchema } from './searchListResponseSchema.ts';
import { searchMovieResponseSchema } from './searchMovieResponseSchema.ts';
import { searchPersonResponseSchema } from './searchPersonResponseSchema.ts';
import { searchShowResponseSchema } from './searchShowResponseSchema.ts';

/** Zod schema for the search result response. */
export const searchResultResponseSchema = z.union([
  searchMovieResponseSchema,
  searchShowResponseSchema,
  searchPersonResponseSchema,
  searchListResponseSchema,
]);
