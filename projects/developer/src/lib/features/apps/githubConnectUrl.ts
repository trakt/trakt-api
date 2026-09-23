import { PUBLIC_GITHUB_CLIENT_ID } from '$env/static/public';
import type { GithubConnectIntent } from './GithubConnectIntent.ts';
import { GITHUB_INTENT_KEY } from './GITHUB_INTENT_KEY.ts';
import { GITHUB_STATE_KEY } from './GITHUB_STATE_KEY.ts';

export function githubConnectUrl(intent: GithubConnectIntent): string {
  const state = globalThis.crypto.randomUUID();
  globalThis.sessionStorage?.setItem(GITHUB_STATE_KEY, state);
  globalThis.sessionStorage?.setItem(GITHUB_INTENT_KEY, intent);
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', PUBLIC_GITHUB_CLIENT_ID);
  url.searchParams.set('redirect_uri', `${globalThis.location.origin}/apps`);
  url.searchParams.set('state', state);
  return url.toString();
}
