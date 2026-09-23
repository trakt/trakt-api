import { z } from 'zod';

export const applicationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullish(),
  client_id: z.string(),
  client_secret: z.string(),
  redirect_uri: z.string(),
  origins: z.array(z.string()),
  approved: z.boolean(),
  approved_at: z.string().nullish(),
  scopes: z.array(z.string()),
  created_at: z.string(),
  permissions: z.object({
    scrobble: z.boolean().nullish(),
    checkin: z.boolean().nullish(),
    account_create: z.boolean().nullish(),
  }),
});
