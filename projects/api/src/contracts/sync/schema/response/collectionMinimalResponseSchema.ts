import { z } from '../../../_internal/z.ts';

/** Zod schema for the collection minimal response. */
export const collectionMinimalResponseSchema = z.record(
  z.string(),
  z.string().datetime(),
);

/** Zod schema for the collection minimal show response. */
export const collectionMinimalShowResponseSchema = z.record(
  z.string(),
  z.record(
    z.string(),
    collectionMinimalResponseSchema,
  ),
);
