import { accountRequest } from '$lib/api/accountRequest.ts';
import type { ApplicationProfile } from './ApplicationProfile.ts';
import { applicationProfileSchema } from './applicationProfileSchema.ts';

export async function getApplicationProfile(
  slot: number,
  appId: number,
): Promise<ApplicationProfile> {
  const response = await accountRequest({
    slot,
    path: `/v3/users/me/applications/${appId}/profile`,
  });
  const parsed = applicationProfileSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error(
      'Your app information could not be read. Please try again.',
    );
  }
  return parsed.data;
}
