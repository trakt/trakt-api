import { z } from 'zod';
import { accountRequest } from '$lib/api/accountRequest.ts';

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
export type Application = z.infer<typeof applicationSchema>;
export type ApplicationInput = {
  name: string;
  description?: string;
  redirect_uri: string[];
  origins: string[];
};

export async function listApplications(slot: number): Promise<Application[]> {
  const response = await accountRequest(slot, '/v3/users/me/applications');
  const parsed = applicationSchema.array().safeParse(await response.json());
  if (!parsed.success) {
    throw new Error('The app list could not be read. Please try again.');
  }
  return parsed.data;
}
export async function saveApplication(
  slot: number,
  input: ApplicationInput,
  id?: number,
): Promise<Application | null> {
  const response = await accountRequest(
    slot,
    `/v3/users/me/applications${id === undefined ? '' : `/${id}`}`,
    {
      method: id === undefined ? 'POST' : 'PATCH',
      body: JSON.stringify(input),
    },
  );
  const parsed = applicationSchema.safeParse(
    await response.json().catch(() => null),
  );
  return parsed.success ? parsed.data : null;
}
export async function deleteApplication(
  slot: number,
  id: number,
): Promise<void> {
  await accountRequest(slot, `/v3/users/me/applications/${id}`, {
    method: 'DELETE',
  });
}
