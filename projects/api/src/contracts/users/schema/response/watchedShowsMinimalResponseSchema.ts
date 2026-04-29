import { z } from '../../../_internal/z.ts';

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
