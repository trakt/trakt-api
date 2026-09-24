import { PUBLIC_TRAKT_CLIENT_ID } from '$env/static/public';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { authFetch } from './authFetch.ts';
import { AUTH_REQUEST_TIMEOUT_SECONDS } from './AUTH_REQUEST_TIMEOUT_SECONDS.ts';

const AUTHORITY = 'https://auth.trakt.tv';
const SCOPE = 'public openid profile email';
const managers = new Map<number, UserManager>();

export function userManager(slot: number): UserManager {
  globalThis.fetch = authFetch(globalThis.fetch);

  const existing = managers.get(slot);
  if (existing) return existing;

  const created = new UserManager({
    authority: AUTHORITY,
    client_id: PUBLIC_TRAKT_CLIENT_ID,
    redirect_uri: `${globalThis.location.origin}/callback`,
    response_type: 'code',
    scope: SCOPE,
    automaticSilentRenew: false,
    requestTimeoutInSeconds: AUTH_REQUEST_TIMEOUT_SECONDS,
    userStore: new WebStorageStateStore({
      prefix: `trakt-developer-account-${slot}.`,
      store: globalThis.localStorage,
    }),
    stateStore: new WebStorageStateStore({
      prefix: `trakt-developer-signin-${slot}.`,
      store: globalThis.localStorage,
    }),
  });

  managers.set(slot, created);
  return created;
}
