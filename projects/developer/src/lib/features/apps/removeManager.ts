import { accountRequest } from '$lib/api/accountRequest.ts';

export async function removeManager(
  slot: number,
  appId: number,
  slug: string,
): Promise<void> {
  await accountRequest({
    slot,
    path: `/v3/users/me/applications/${appId}/managers/${
      encodeURIComponent(slug)
    }`,
    init: { method: 'DELETE' },
  });
}
