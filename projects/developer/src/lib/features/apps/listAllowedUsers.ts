import { accountRequest } from '$lib/api/accountRequest.ts';
import { allowedUsersSchema } from './allowedUsersSchema.ts';

export async function listAllowedUsers(slot: number, appId: number) {
  const response = await accountRequest({
    slot,
    path: `/v3/users/me/applications/${appId}/allowed-users`,
  });
  const parsed = allowedUsersSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error('The sign-in list could not be read. Please try again.');
  }
  return parsed.data;
}
