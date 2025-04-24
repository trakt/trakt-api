import type { CombinationsFrom } from '../../../types/CombinationsFrom.ts';
import { z } from '../z.ts';

export const linksQuerySchema = z.object({
  links: z.custom<CombinationsFrom<['tvos', 'direct']>>().optional(),
});
