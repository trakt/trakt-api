import { z } from 'zod';

export const productionSignInSchema = z.enum(['none', 'pkce', 'device_code']);
