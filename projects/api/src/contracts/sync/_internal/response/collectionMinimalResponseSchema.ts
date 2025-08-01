import { z } from '../../../_internal/z.ts';

export const collectionMinimalResponseSchema = z.record(
  z.string(),
  z.string().datetime(),
);
