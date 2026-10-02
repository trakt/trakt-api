import type { GithubConnectIntent } from './GithubConnectIntent.ts';
import { GITHUB_INTENT_KEY } from './GITHUB_INTENT_KEY.ts';
import { GITHUB_STATE_KEY } from './GITHUB_STATE_KEY.ts';

type GithubConnectUrlParams = {
  intent: GithubConnectIntent;
  clientId: string;
};

export function githubConnectUrl(
  { intent, clientId }: GithubConnectUrlParams,
): string {
  const state = globalThis.crypto.randomUUID();
  globalThis.sessionStorage?.setItem(GITHUB_STATE_KEY, state);
  globalThis.sessionStorage?.setItem(GITHUB_INTENT_KEY, intent);
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', `${globalThis.location.origin}/apps`);
  url.searchParams.set('state', state);
  return url.toString();
}
