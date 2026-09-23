import { takeSessionValue } from '$lib/auth/takeSessionValue.ts';
import { GITHUB_INTENT_KEY } from './GITHUB_INTENT_KEY.ts';
import { GITHUB_STATE_KEY } from './GITHUB_STATE_KEY.ts';

type GithubConnectOutcome =
  | { status: 'connected'; code: string; allowSwitch: boolean }
  | { status: 'denied' }
  | { status: 'invalid' };

export function completeGithubConnect(
  searchParams: URLSearchParams,
): GithubConnectOutcome {
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const expectedState = takeSessionValue(GITHUB_STATE_KEY);
  const intent = takeSessionValue(GITHUB_INTENT_KEY);

  if (!state || !expectedState || state !== expectedState) {
    return { status: 'invalid' };
  }

  if (!code) return { status: 'denied' };

  return { status: 'connected', code, allowSwitch: intent === 'switch' };
}
