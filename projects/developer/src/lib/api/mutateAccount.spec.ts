import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mutateAccount } from './mutateAccount.ts';
import { refreshAccount } from '$lib/auth/refreshAccount.ts';
import { signOutAccount } from '$lib/auth/signOutAccount.ts';

vi.mock('$lib/auth/refreshAccount.ts', () => ({
  refreshAccount: vi.fn(),
}));
vi.mock('$lib/auth/signOutAccount.ts', () => ({
  signOutAccount: vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

describe('account actions', () => {
  it('refreshes the selected account', async () => {
    await mutateAccount(3, 'POST');
    expect(refreshAccount).toHaveBeenCalledWith(3);
    expect(signOutAccount).not.toHaveBeenCalled();
  });

  it('logs out the selected account', async () => {
    await mutateAccount(3, 'DELETE');
    expect(signOutAccount).toHaveBeenCalledWith(3);
    expect(refreshAccount).not.toHaveBeenCalled();
  });

  it('reports refresh failure without exposing the cause', async () => {
    vi.mocked(refreshAccount).mockRejectedValue(
      new Error('refresh_token=private'),
    );
    await expect(mutateAccount(0, 'POST')).rejects.toThrow(
      'Could not refresh access token. Try again or reconnect your account.',
    );
  });

  it('reports failed logout instead of treating it as success', async () => {
    vi.mocked(signOutAccount).mockRejectedValue(new Error('denied'));
    await expect(mutateAccount(0, 'DELETE')).rejects.toThrow(
      'Could not log out. Try again.',
    );
  });
});
