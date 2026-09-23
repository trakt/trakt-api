import { accountRequest } from '$lib/api/accountRequest.ts';
import { GITHUB_PATH } from './GITHUB_PATH.ts';

export async function unlinkGithub(slot: number): Promise<void> {
  await accountRequest({ slot, path: GITHUB_PATH, init: { method: 'DELETE' } });
}
