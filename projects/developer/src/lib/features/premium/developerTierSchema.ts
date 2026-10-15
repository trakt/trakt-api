import { z } from 'zod';

export const developerTierSchema = z.enum(['standard', 'premium']);
