import { z } from 'zod';
import { PUBLIC_GITHUB_CLIENT_ID } from '$env/static/public';
import { safeReturnPath } from '$lib/auth/accountNavigation.ts';

const STATE_KEY = 'trakt-developer-github-state';
const RETURN_PATH_KEY = 'trakt-developer-github-return';
const CODE_KEY = 'trakt-developer-github-code';
const DRAFT_KEY = 'trakt-developer-github-draft';

const draftSchema = z.object({
  name: z.string(),
  description: z.string(),
  redirects: z.string(),
  origins: z.string(),
});

export type ApplicationDraft = z.infer<typeof draftSchema>;

export type GithubConnectOutcome =
  | { status: 'connected'; returnPath: string }
  | { status: 'denied' }
  | { status: 'invalid' };

function take(key: string): string | null {
  const value = globalThis.sessionStorage?.getItem(key) ?? null;
  globalThis.sessionStorage?.removeItem(key);
  return value;
}

export function isGithubCallback(searchParams: URLSearchParams): boolean {
  return searchParams.has('code') || searchParams.has('error');
}

export function githubConnectUrl(
  returnPath: string,
  draft: ApplicationDraft,
): string {
  const state = globalThis.crypto.randomUUID();
  globalThis.sessionStorage?.setItem(STATE_KEY, state);
  globalThis.sessionStorage?.setItem(RETURN_PATH_KEY, returnPath);
  globalThis.sessionStorage?.setItem(DRAFT_KEY, JSON.stringify(draft));
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
  const expectedState = take(STATE_KEY);
  const returnPath = safeReturnPath(take(RETURN_PATH_KEY));

  if (!state || !expectedState || state !== expectedState) {
    take(DRAFT_KEY);
    return { status: 'invalid' };
  }

  if (!code) {
    take(DRAFT_KEY);
    return { status: 'denied' };
  }

  globalThis.sessionStorage?.setItem(CODE_KEY, code);
  return { status: 'connected', returnPath };
}

export function takeGithubCode(): string | null {
  return take(CODE_KEY);
}

export function takeGithubDraft(): ApplicationDraft | null {
  const raw = take(DRAFT_KEY);
  if (!raw) return null;
  try {
    const parsed = draftSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
