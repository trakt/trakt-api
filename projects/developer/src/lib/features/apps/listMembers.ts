import type { AppMember } from './AppMember.ts';
import { listAllowedUsers } from './listAllowedUsers.ts';
import { listManagers } from './listManagers.ts';

type AppMembers = { members: AppMember[]; seatLimit: number };

export async function listMembers(
  slot: number,
  appId: number,
  dev: boolean,
): Promise<AppMembers> {
  const [managers, testers] = await Promise.all([
    listManagers(slot, appId),
    dev ? listAllowedUsers(slot, appId) : { limit: 0, users: [] },
  ]);
  const toMember = (role: AppMember['role']) =>
  (entry: {
    user: { username: string; ids: { slug: string } };
    added_at: string;
  }): AppMember => ({
    username: entry.user.username,
    slug: entry.user.ids.slug,
    role,
    addedAt: entry.added_at,
  });

  return {
    members: [
      ...managers.map(toMember('manager')),
      ...testers.users.map(toMember('tester')),
    ],
    seatLimit: testers.limit,
  };
}
