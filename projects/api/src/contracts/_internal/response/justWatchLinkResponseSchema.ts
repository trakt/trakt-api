import { z } from '../z.ts';

export const justWatchLinkResponseSchema = z.record(
  z.string(),
  z.string(),
);
