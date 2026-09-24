import { User } from 'oidc-client-ts';
import { describe, expect, it, vi } from 'vitest';
import { markRejectedSession } from './markRejectedSession.ts';

function user(accessToken: string) {
  return new User({
    access_token: accessToken,
    token_type: 'Bearer',
    profile: { sub: 'account', iss: 'trakt', aud: 'portal', exp: 0, iat: 0 },
  });
}

describe('rejected sessions', () => {
  it.each(['old-token', 'new-token', null])(
    'marks only a rejected token that is still current: %s',
    async (currentToken) => {
      const mark = vi.fn();
      await markRejectedSession({
        slot: 2,
        accessToken: 'old-token',
        manager: () => ({
          getUser: async () => currentToken ? user(currentToken) : null,
        }),
        lock: (_slot, operation) => operation(),
        mark,
      });
      expect(mark.mock.calls).toEqual(
        currentToken === 'old-token' ? [[2]] : [],
      );
    },
  );

  it('waits for an in-flight refresh before comparing tokens', async () => {
    let stored = user('old-token');
    let release: () => void = () => {};
    const refreshing = new Promise<void>((resolve) => {
      release = resolve;
    });
    const mark = vi.fn();
    const rejected = markRejectedSession({
      slot: 0,
      accessToken: 'old-token',
      manager: () => ({ getUser: async () => stored }),
      lock: async (_slot, operation) => {
        await refreshing;
        return operation();
      },
      mark,
    });
    stored = user('new-token');
    release();
    await rejected;
    expect(mark).not.toHaveBeenCalled();
  });
});
