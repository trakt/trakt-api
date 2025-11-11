import { z } from '../../../_internal/z.ts';

export const watchedMoviesMinimalResponseSchema = z.record(
  z.string(),
  z.string().datetime().array(),
);
