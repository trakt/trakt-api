import { accountRequest } from '$lib/api/accountRequest.ts';
import { GITHUB_PATH } from './GITHUB_PATH.ts';

export async function linkGithub(
  slot: number,
  code: string,
  allowSwitch: boolean,
): Promise<void> {
  await accountRequest({
    slot,
    path: GITHUB_PATH,
    init: {
      method: 'PUT',
      body: JSON.stringify({ code, switch: allowSwitch }),
    },
  });
}
