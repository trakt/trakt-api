import { afterEach, describe, expect, it, vi } from 'vitest';
vi.mock(
  '$env/static/public',
  () => ({ PUBLIC_GITHUB_CLIENT_ID: 'test-client' }),
);

import { githubConnectUrl } from './githubConnectUrl.ts';

function fakeStorage(): Storage {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  } as unknown as Storage;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('githubConnectUrl', () => {
  it('builds the authorize url and stashes the state and intent', () => {
    const storage = fakeStorage();
    vi.stubGlobal('sessionStorage', storage);
    vi.stubGlobal('location', { origin: 'https://developer.trakt.tv' });
    vi.stubGlobal('crypto', { randomUUID: () => 'fixed-state' });

    const url = new URL(githubConnectUrl('switch'));

    expect(url.origin + url.pathname).toBe(
      'https://github.com/login/oauth/authorize',
    );
    expect(url.searchParams.get('client_id')).toBe('test-client');
    expect(url.searchParams.get('redirect_uri')).toBe(
      'https://developer.trakt.tv/apps',
    );
    expect(url.searchParams.has('scope')).toBe(false);
    expect(url.searchParams.get('state')).toBe('fixed-state');
    expect(storage.getItem('trakt-developer-github-state')).toBe(
      'fixed-state',
    );
    expect(storage.getItem('trakt-developer-github-intent')).toBe('switch');
  });
});
