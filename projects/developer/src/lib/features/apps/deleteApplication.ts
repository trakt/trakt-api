import { accountRequest } from '$lib/api/accountRequest.ts';

export async function deleteApplication(
  slot: number,
  id: number,
): Promise<void> {
  await accountRequest({
    slot,
    path: `/v3/users/me/applications/${id}`,
    init: { method: 'DELETE' },
  });
}
