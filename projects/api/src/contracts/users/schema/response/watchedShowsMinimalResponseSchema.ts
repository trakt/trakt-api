import { z } from '../../../_internal/z.ts';

/** Zod schema for the watched shows minimal response. */
export const watchedShowsMinimalResponseSchema = z.record(
  z.string(),
  z.record(
    z.string(),
    z.record(
      z.string(),
      z.string().datetime().array(),
    ),
  ),
);
