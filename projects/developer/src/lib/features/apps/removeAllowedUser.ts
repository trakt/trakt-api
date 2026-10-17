import { accountRequest } from '$lib/api/accountRequest.ts';

export async function removeAllowedUser(
  slot: number,
  appId: number,
  slug: string,
): Promise<void> {
  await accountRequest({
    slot,
    path: `/v3/users/me/applications/${appId}/allowed-users/${
      encodeURIComponent(slug)
    }`,
    init: { method: 'DELETE' },
  });
}
