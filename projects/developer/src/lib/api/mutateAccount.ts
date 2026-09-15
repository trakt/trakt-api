import { refreshAccount } from '$lib/auth/refreshAccount.ts';
import { signOutAccount } from '$lib/auth/signOutAccount.ts';

export async function mutateAccount(
  slot: number,
  method: 'POST' | 'DELETE',
): Promise<void> {
  const isRefresh = method === 'POST';

  try {
    await (isRefresh ? refreshAccount(slot) : signOutAccount(slot));
  } catch {
    throw new Error(
      `Could not ${isRefresh ? 'refresh access token' : 'log out'}. Try again${
        isRefresh ? ' or reconnect your account' : ''
      }.`,
    );
  }
}
