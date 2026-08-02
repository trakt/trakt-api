import { z } from '../../../_internal/z.ts';

/** Zod schema for the watched episodes minimal response. */
export const watchedEpisodesMinimalResponseSchema = z.record(
  z.string(),
  z.string().datetime().array(),
);
