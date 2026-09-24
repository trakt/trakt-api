import { User } from 'oidc-client-ts';
import { describe, expect, it, vi } from 'vitest';
import { createAccessTokenProvider } from './createAccessTokenProvider.ts';

const NOW = 1_700_000_000_000;

function session(expiresAt = NOW / 1000 + 3600, token = 'fresh') {
  return new User({
    access_token: token,
    refresh_token: 'refresh',
    token_type: 'Bearer',
    expires_at: expiresAt,
    profile: {
      sub: 'account',
      iss: 'trakt',
      aud: 'portal',
      exp: expiresAt,
      iat: 0,
    },
  });
}

function setup() {
  const users = new Map<number, User | null>([[
    0,
    session(NOW / 1000 - 1, 'expired'),
  ]]);
  const values = new Map<string, string>();
  const queues = new Map<number, Promise<unknown>>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
  const renew = vi.fn(async (slot: number) => {
    const user = session(undefined, `fresh-${slot}`);
    users.set(slot, user);
    return user;
  });
  const clock = { value: NOW };
  const onSessionError = vi.fn();
  const dependencies = {
    onSessionError,
    manager: (slot: number) => ({
      getUser: async () => users.get(slot) ?? null,
      signinSilent: () => renew(slot),
    }),
    lock: <T>(slot: number, operation: () => Promise<T>): Promise<T> => {
      const result = (queues.get(slot) ?? Promise.resolve()).catch(() => {})
        .then(operation);
      queues.set(slot, result);
      return result;
    },
    storage: () => storage,
    now: () => clock.value,
  };
  return {
    users,
    renew,
    clock,
    dependencies,
    token: createAccessTokenProvider(dependencies),
  };
}

describe('access token provider', () => {
  it('reuses fresh tokens without renewing', async () => {
    const { users, renew, token } = setup();
    users.set(0, session());
    await expect(token(0)).resolves.toBe('fresh');
    await expect(token(0)).resolves.toBe('fresh');
    expect(renew).not.toHaveBeenCalled();
  });

  it.each([NOW / 1000 - 1, NOW / 1000 + 60, undefined])(
    'renews expired, nearly expired, or unknown expiry %s',
    async (expiry) => {
      const { users, token, renew } = setup();
      const user = session();
      user.expires_at = expiry;
      users.set(0, user);
      await expect(token(0)).resolves.toBe('fresh-0');
      expect(renew).toHaveBeenCalledTimes(1);
    },
  );

  it('shares one refresh among concurrent callers', async () => {
    const { token, renew } = setup();
    const tokens = await Promise.all(
      Array.from({ length: 20 }, () => token(0)),
    );
    expect(tokens).toEqual(Array(20).fill('fresh-0'));
    expect(renew).toHaveBeenCalledTimes(1);
  });

  it('rereads the rotated token when another tab has refreshed', async () => {
    const { token, renew, dependencies } = setup();
    const otherTab = createAccessTokenProvider(dependencies);
    await expect(Promise.all([token(0), otherTab(0)])).resolves.toEqual([
      'fresh-0',
      'fresh-0',
    ]);
    expect(renew).toHaveBeenCalledTimes(1);
  });

  it('allows another account to refresh while the first is waiting', async () => {
    const { users, token, renew } = setup();
    users.set(1, session(0));
    let finish: (user: User) => void = () => {};
    renew.mockImplementationOnce(() =>
      new Promise<User>((resolve) => {
        finish = resolve;
      })
    );
    const first = token(0);
    await expect(token(1)).resolves.toBe('fresh-1');
    finish(session(undefined, 'fresh-0'));
    await expect(first).resolves.toBe('fresh-0');
  });

  it('keeps the session and shares a failure cooldown across tabs before retrying', async () => {
    const { token, renew, dependencies, users, clock } = setup();
    renew.mockRejectedValueOnce(new Error('offline'));
    await expect(token(0)).rejects.toThrow('Could not refresh');
    expect(dependencies.onSessionError).toHaveBeenCalledWith(0);
    const otherTab = createAccessTokenProvider(dependencies);
    await expect(otherTab(0)).rejects.toThrow('temporarily unavailable');
    expect(users.get(0)?.access_token).toBe('expired');
    expect(renew).toHaveBeenCalledTimes(1);
    clock.value += 30_001;
    await expect(otherTab(0)).resolves.toBe('fresh-0');
    expect(renew).toHaveBeenCalledTimes(2);
  });

  it('does not use iframe sign-in when a refresh token is missing', async () => {
    const { token, users, renew } = setup();
    const user = session(0);
    user.refresh_token = undefined;
    users.set(0, user);
    await expect(token(0)).rejects.toThrow('Sign in again');
    expect(renew).not.toHaveBeenCalled();
  });

  it('rejects a refresh response that is already expiring', async () => {
    const { token, renew } = setup();
    renew.mockResolvedValueOnce(session(NOW / 1000 + 10));
    await expect(token(0)).rejects.toThrow('Could not refresh');
  });

  it('does not refresh a session removed while waiting for the lock', async () => {
    const { token, users, renew, dependencies } = setup();
    const logout = dependencies.lock(0, async () => {
      users.delete(0);
    });
    const request = token(0);
    await logout;
    await expect(request).resolves.toBeNull();
    expect(renew).not.toHaveBeenCalled();
  });
});
