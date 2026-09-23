import { accountRequest } from '$lib/api/accountRequest.ts';
import type { DeveloperProfile } from './DeveloperProfile.ts';
import { developerProfileSchema } from './developerProfileSchema.ts';

export async function getDeveloperProfile(
  slot: number,
): Promise<DeveloperProfile> {
  const response = await accountRequest({
    slot,
    path: '/v3/users/me/developer',
  });
  const parsed = developerProfileSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error(
      'Your developer account could not be read. Please try again.',
    );
  }
  return parsed.data;
}
