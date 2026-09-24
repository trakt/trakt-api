import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { accountSessionErrors } from './accountSessionErrors.ts';
import { listAccounts } from './listAccounts.ts';
import { userManager } from './userManager.ts';

vi.mock('./userManager.ts', () => ({ userManager: vi.fn() }));

const NOW_SECONDS = 1_700_000_000;

function storedUsers(bySlot: Record<number, number | null>) {
  vi.mocked(userManager).mockImplementation((slot: number) => {
    const expiresAt = bySlot[slot];
    return {
      getUser: () =>
        Promise.resolve(
          expiresAt === undefined || expiresAt === null
            ? null
            : { access_token: 'token', expires_at: expiresAt },
        ),
    } as unknown as ReturnType<typeof userManager>;
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW_SECONDS * 1000);
  globalThis.localStorage?.clear?.();
});

afterEach(() => vi.useRealTimers());

describe('list accounts', () => {
  it('distinguishes failed sessions from tokens that can still refresh automatically', async () => {
    storedUsers({ 0: NOW_SECONDS - 1, 1: NOW_SECONDS - 1 });
    accountSessionErrors.mark(0);
    const accounts = await listAccounts();
    expect(accounts.map((account) => account.hasSessionError)).toEqual([
      true,
      false,
    ]);
    accountSessionErrors.clear(0);
  });

  it('returns nothing when no slot holds a session', async () => {
    storedUsers({});
    await expect(listAccounts()).resolves.toEqual([]);
  });

  it('reports only the slots that hold a session', async () => {
    storedUsers({ 0: NOW_SECONDS + 100, 3: NOW_SECONDS + 100 });
    const accounts = await listAccounts();
    expect(accounts.map((account) => account.slot)).toEqual([0, 3]);
  });

  it('marks a session whose token has expired', async () => {
    storedUsers({ 0: NOW_SECONDS + 100, 1: NOW_SECONDS - 1 });
    const accounts = await listAccounts();
    expect(accounts.map((account) => account.isExpired)).toEqual([false, true]);
  });

  it('falls back to the slot name when no username is cached', async () => {
    storedUsers({ 2: NOW_SECONDS + 100 });
    const [account] = await listAccounts();
    expect(account?.username).toBe('Account 3');
  });

  it('skips a slot whose stored session cannot be read', async () => {
    vi.mocked(userManager).mockImplementation(() =>
      ({
        getUser: () => Promise.reject(new Error('corrupt')),
      }) as unknown as ReturnType<typeof userManager>
    );
    await expect(listAccounts()).resolves.toEqual([]);
  });
});
