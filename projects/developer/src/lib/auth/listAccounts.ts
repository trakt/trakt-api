import type { DeveloperAccount } from '$lib/api/DeveloperAccount.ts';
import { ACCOUNT_LIMIT } from './accountSlots.ts';
import { readUsername } from './accountUsername.ts';
import { userManager } from './userManager.ts';

export async function listAccounts(): Promise<
  ReadonlyArray<DeveloperAccount>
> {
  const stored = await Promise.all(
    Array.from(
      { length: ACCOUNT_LIMIT },
      (_, slot) =>
        userManager(slot).getUser()
          .catch(() => null)
          .then((user) => ({ slot, user })),
    ),
  );

  const now = Math.floor(Date.now() / 1000);

  return stored.flatMap(({ slot, user }) => {
    if (!user) return [];

    const expiresAt = user.expires_at ?? 0;
    return [{
      slot,
      username: readUsername(slot),
      expiresAt,
      isExpired: expiresAt <= now,
      source: 'developer-oauth' as const,
    }];
  });
}
