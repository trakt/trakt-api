import { accountRequest } from '$lib/api/accountRequest.ts';

export async function addManager(
  slot: number,
  appId: number,
  username: string,
): Promise<void> {
  await accountRequest({
    slot,
    path: `/v3/users/me/applications/${appId}/managers/${
      encodeURIComponent(username)
    }`,
    init: { method: 'POST' },
  });
}
