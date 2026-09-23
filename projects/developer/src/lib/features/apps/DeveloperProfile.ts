import { z } from 'zod';
import { developerProfileSchema } from './developerProfileSchema.ts';

export type DeveloperProfile = z.infer<typeof developerProfileSchema>;
