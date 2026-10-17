import { accountRequest } from '$lib/api/accountRequest.ts';
import type { FollowedUser } from './FollowedUser.ts';
import { followingSchema } from './followingSchema.ts';

const FOLLOWING_PAGE_SIZE = 250;

export async function listFollowing(slot: number): Promise<FollowedUser[]> {
  const response = await accountRequest({
    slot,
    path: `/users/me/following?limit=${FOLLOWING_PAGE_SIZE}`,
  });
  const parsed = followingSchema.safeParse(await response.json());
  if (!parsed.success) return [];
  return parsed.data.map(({ user }) => ({
    username: user.username,
    slug: user.ids.slug,
  }));
}
