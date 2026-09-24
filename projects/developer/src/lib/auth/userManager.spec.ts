import { InMemoryWebStorage, User } from 'oidc-client-ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AUTH_REQUEST_TIMEOUT_SECONDS } from './AUTH_REQUEST_TIMEOUT_SECONDS.ts';
import { createAccessTokenProvider } from './createAccessTokenProvider.ts';
import { userManager } from './userManager.ts';
import { signOutAccount } from './signOutAccount.ts';

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('location', { origin: 'https://developer.trakt.tv' });
  vi.stubGlobal('localStorage', new InMemoryWebStorage());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

function storedUser() {
  return new User({
    access_token: 'expired',
    refresh_token: 'refresh',
    expires_at: 1,
    token_type: 'Bearer',
    profile: {
      sub: 'test',
      iss: 'https://auth.trakt.tv',
      aud: 'test',
      exp: 1,
      iat: 0,
    },
  });
}

function stallRequests({ discovery = false, body = false } = {}) {
  const signals: AbortSignal[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn((_url: string, init: RequestInit) => {
      if (!discovery && String(_url).includes('.well-known')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              issuer: 'https://auth.trakt.tv',
              token_endpoint: 'https://auth.trakt.tv/oauth/token',
              revocation_endpoint: 'https://auth.trakt.tv/oauth/revoke',
            }),
            { headers: { 'content-type': 'application/json' } },
          ),
        );
      }

      const signal = init.signal;
      if (!signal) throw new Error('Request has no abort signal');
      signals.push(signal);
      if (body) {
        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('{'));
            signal.addEventListener(
              'abort',
              () => controller.error(signal.reason),
              { once: true },
            );
          },
        });
        return Promise.resolve(
          new Response(stream, {
            headers: { 'content-type': 'application/json' },
          }),
        );
      }
      return new Promise<Response>((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason), {
          once: true,
        });
      });
    }),
  );
  return signals;
}

describe('authentication request timeouts', () => {
  it.each([false, true])(
    'aborts a stalled refresh (body: %s), preserves the session, and releases the account queue',
    async (body) => {
      const signals = stallRequests({ body });
      const manager = userManager(0);
      await manager.storeUser(storedUser());
      let queue: Promise<unknown> = Promise.resolve();
      const lock = <T>(_slot: number, operation: () => Promise<T>) => {
        const result = queue.catch(() => {}).then(operation);
        queue = result;
        return result;
      };
      const token = createAccessTokenProvider({
        manager: () => manager,
        lock,
        storage: () => globalThis.localStorage,
      });

      const failed = expect(token(0)).rejects.toThrow(
        'sign in again from the account menu',
      );
      const queued = lock(0, async () => 'released');
      await vi.advanceTimersByTimeAsync(AUTH_REQUEST_TIMEOUT_SECONDS * 1000);
      await failed;
      await expect(queued).resolves.toBe('released');
      expect(signals).toHaveLength(1);
      expect(signals.at(0)?.aborted).toBe(true);
      expect((await manager.getUser())?.refresh_token).toBe('refresh');
    },
  );

  it.each([false, true])(
    'aborts stalled discovery (body: %s) instead of holding the lock indefinitely',
    async (body) => {
      const signals = stallRequests({ discovery: true, body });
      const manager = userManager(1);
      await manager.storeUser(storedUser());
      const failed = expect(manager.signinSilent()).rejects.toThrow();
      await vi.advanceTimersByTimeAsync(AUTH_REQUEST_TIMEOUT_SECONDS * 1000);
      await failed;
      expect(signals.at(0)?.aborted).toBe(true);
    },
  );

  it.each([false, true])(
    'aborts stalled revocation (body: %s) so logout can continue with local removal',
    async (body) => {
      const signals = stallRequests({ body });
      const manager = userManager(2);
      await manager.storeUser(storedUser());
      vi.stubGlobal('navigator', {
        locks: {
          request: (_name: string, operation: () => Promise<void>) =>
            operation(),
        },
      });
      const logout = signOutAccount(2);
      await vi.advanceTimersByTimeAsync(AUTH_REQUEST_TIMEOUT_SECONDS * 1000);
      await logout;
      expect(await manager.getUser()).toBeNull();
      expect(signals.at(0)?.aborted).toBe(true);
    },
  );
});
