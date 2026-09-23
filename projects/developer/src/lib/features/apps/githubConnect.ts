import { PUBLIC_GITHUB_CLIENT_ID } from '$env/static/public';
import { takeSessionValue } from '$lib/auth/takeSessionValue.ts';

const STATE_KEY = 'trakt-developer-github-state';
const INTENT_KEY = 'trakt-developer-github-intent';

export type GithubConnectIntent = 'link' | 'switch';

type GithubConnectOutcome =
  | { status: 'connected'; code: string; allowSwitch: boolean }
  | { status: 'denied' }
  | { status: 'invalid' };

export function isGithubCallback(searchParams: URLSearchParams): boolean {
  return searchParams.has('code') || searchParams.has('error');
}

export function githubConnectUrl(intent: GithubConnectIntent): string {
  const state = globalThis.crypto.randomUUID();
  globalThis.sessionStorage?.setItem(STATE_KEY, state);
  globalThis.sessionStorage?.setItem(INTENT_KEY, intent);
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', PUBLIC_GITHUB_CLIENT_ID);
  url.searchParams.set('redirect_uri', `${globalThis.location.origin}/apps`);
  url.searchParams.set('state', state);
  return url.toString();
}

export function completeGithubConnect(
  searchParams: URLSearchParams,
): GithubConnectOutcome {
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const expectedState = takeSessionValue(STATE_KEY);
  const intent = takeSessionValue(INTENT_KEY);

  if (!state || !expectedState || state !== expectedState) {
    return { status: 'invalid' };
  }

  if (!code) return { status: 'denied' };

  return { status: 'connected', code, allowSwitch: intent === 'switch' };
}
