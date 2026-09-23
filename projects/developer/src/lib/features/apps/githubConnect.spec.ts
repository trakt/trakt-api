import { afterEach, describe, expect, it, vi } from 'vitest';
vi.mock(
  '$env/static/public',
  () => ({ PUBLIC_GITHUB_CLIENT_ID: 'test-client' }),
);
import {
  completeGithubConnect,
  githubConnectUrl,
  isGithubCallback,
} from './githubConnect.ts';

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

describe('completeGithubConnect', () => {
  function pending(intent: string) {
    const storage = fakeStorage();
    storage.setItem('trakt-developer-github-state', 'expected-state');
    storage.setItem('trakt-developer-github-intent', intent);
    vi.stubGlobal('sessionStorage', storage);
    return storage;
  }

  it('returns the code for a matching state and ignores unknown params', () => {
    const storage = pending('link');
    const params = new URLSearchParams({
      code: 'abc',
      state: 'expected-state',
      iss: 'https://github.com/login/oauth',
    });
    expect(completeGithubConnect(params)).toEqual({
      status: 'connected',
      code: 'abc',
      allowSwitch: false,
    });
    expect(storage.getItem('trakt-developer-github-state')).toBeNull();
    expect(storage.getItem('trakt-developer-github-intent')).toBeNull();
  });
  it('carries a switch intent through', () => {
    pending('switch');
    expect(
      completeGithubConnect(
        new URLSearchParams({ code: 'abc', state: 'expected-state' }),
      ),
    ).toEqual({ status: 'connected', code: 'abc', allowSwitch: true });
  });
  it('rejects a mismatched state', () => {
    pending('link');
    expect(
      completeGithubConnect(
        new URLSearchParams({ code: 'abc', state: 'other' }),
      ),
    ).toEqual({ status: 'invalid' });
  });
  it('rejects a missing state', () => {
    vi.stubGlobal('sessionStorage', fakeStorage());
    expect(
      completeGithubConnect(new URLSearchParams({ code: 'abc' })),
    ).toEqual({ status: 'invalid' });
  });
  it('reports a denial callback and clears the pending state', () => {
    const storage = pending('switch');
    const params = new URLSearchParams({
      error: 'access_denied',
      error_description: 'The user has denied your application access.',
      state: 'expected-state',
    });
    expect(completeGithubConnect(params)).toEqual({ status: 'denied' });
    expect(storage.getItem('trakt-developer-github-state')).toBeNull();
    expect(storage.getItem('trakt-developer-github-intent')).toBeNull();
  });
});

describe('isGithubCallback', () => {
  it('recognises both the code and the error callback', () => {
    expect(isGithubCallback(new URLSearchParams({ code: 'abc' }))).toBe(true);
    expect(isGithubCallback(new URLSearchParams({ error: 'access_denied' })))
      .toBe(true);
  });
  it('ignores a plain visit to the apps page', () => {
    expect(isGithubCallback(new URLSearchParams())).toBe(false);
  });
});
