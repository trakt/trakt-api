import type { CombinationsFrom } from '../../../types/CombinationsFrom.ts';
import { z } from '../z.ts';

/** Zod schema for the links query parameters. */
export const linksQuerySchema = z.object({
  links: z.custom<CombinationsFrom<['tvos', 'direct', 'android', 'webos']>>()
    .nullish(),
});
