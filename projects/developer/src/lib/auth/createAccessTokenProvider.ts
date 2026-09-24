import type { User, UserManager } from 'oidc-client-ts';
import { AUTH_REQUEST_TIMEOUT_SECONDS } from './AUTH_REQUEST_TIMEOUT_SECONDS.ts';

const EXPIRY_MARGIN_SECONDS = 60;
const RETRY_DELAY_MS = 30_000;

function isFresh(user: User | null, now: number): boolean {
  return Boolean(
    user?.access_token && Number.isFinite(user.expires_at) &&
      (user.expires_at ?? 0) > now / 1000 + EXPIRY_MARGIN_SECONDS,
  );
}

export function createAccessTokenProvider({
  manager,
  lock,
  storage,
  now = Date.now,
  onSessionError = () => {},
}: {
  manager: (slot: number) => Pick<UserManager, 'getUser' | 'signinSilent'>;
  lock: <T>(slot: number, operation: () => Promise<T>) => Promise<T>;
  storage: () => Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  now?: () => number;
  onSessionError?: (slot: number) => void;
}): (slot: number) => Promise<string | null> {
  const pending = new Map<number, Promise<string | null>>();

  async function resolveToken(slot: number): Promise<string | null> {
    const account = manager(slot);
    // Read inside the lock: another tab may have rotated the stored tokens.
    const user = await account.getUser();
    if (!user) return null;
    if (isFresh(user, now())) return user.access_token;
    if (!user.refresh_token) {
      onSessionError(slot);
      throw new Error(
        'Your session has expired. Sign in again from the account menu.',
      );
    }

    const retryKey = `trakt-developer-refresh-retry-${slot}`;
    const store = storage();
    const retryAt = Number(store.getItem(retryKey));
    if (retryAt > now()) {
      onSessionError(slot);
      throw new Error(
        'Account refresh is temporarily unavailable. Try again shortly or sign in again from the account menu.',
      );
    }

    // Share the cooldown across tabs, including failed or interrupted refreshes.
    store.setItem(retryKey, String(now() + RETRY_DELAY_MS));
    try {
      const refreshed = await account.signinSilent({
        silentRequestTimeoutInSeconds: AUTH_REQUEST_TIMEOUT_SECONDS,
      });
      if (!refreshed || !isFresh(refreshed, now())) {
        throw new Error('Trakt did not return a valid access token.');
      }

      store.removeItem(retryKey);
      return refreshed.access_token;
    } catch {
      onSessionError(slot);
      store.setItem(retryKey, String(now() + RETRY_DELAY_MS));
      throw new Error(
        'Could not refresh your account. Try again shortly or sign in again from the account menu.',
      );
    }
  }

  return (slot) => {
    const existing = pending.get(slot);
    if (existing) return existing;

    const request = lock(slot, () => resolveToken(slot)).finally(() => {
      pending.delete(slot);
    });
    pending.set(slot, request);
    return request;
  };
}
