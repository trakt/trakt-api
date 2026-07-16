import { z } from '../../../_internal/z.ts';

/** Zod schema for the watched movies minimal response. */
export const watchedMoviesMinimalResponseSchema = z.record(
  z.string(),
  z.string().datetime().array(),
);
