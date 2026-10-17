import { z } from 'zod';

export const applicationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullish(),
  client_id: z.string(),
  client_secret: z.string().nullish(),
  redirect_uri: z.string(),
  origins: z.array(z.string()),
  approved: z.boolean(),
  approved_at: z.string().nullish(),
  scopes: z.array(z.string()),
  created_at: z.string(),
  dev: z.boolean(),
  allowed_user_count: z.number(),
  manager_count: z.number(),
  role: z.enum(['owner', 'manager']),
  owner: z.object({ username: z.string() }),
  permissions: z.object({
    scrobble: z.boolean().nullish(),
    checkin: z.boolean().nullish(),
    account_create: z.boolean().nullish(),
  }),
});
