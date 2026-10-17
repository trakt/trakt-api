import { accountRequest } from '$lib/api/accountRequest.ts';

export async function addAllowedUser(
  slot: number,
  appId: number,
  username: string,
): Promise<void> {
  await accountRequest({
    slot,
    path: `/v3/users/me/applications/${appId}/allowed-users/${
      encodeURIComponent(username)
    }`,
    init: { method: 'POST' },
  });
}
