import { z } from 'zod';
import { developerTierSchema } from './developerTierSchema.ts';

export type DeveloperTier = z.infer<typeof developerTierSchema>;
