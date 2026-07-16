import { z } from '../z.ts';

/** Zod schema for the just watch link response. */
export const justWatchLinkResponseSchema = z.record(
  z.string(),
  z.string(),
);
