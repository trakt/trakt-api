import { z } from '../z.ts';

export const reportRequestSchemaFactory = <
  const T extends readonly [string, ...string[]],
>(reasons: T) =>
  z.object({
    reason: z.enum(reasons).openapi({
      description: 'Reason this item is being reported for moderator review.',
    }),
    message: z.string().optional().openapi({
      description: 'Optional additional context for the report.',
    }),
  });
