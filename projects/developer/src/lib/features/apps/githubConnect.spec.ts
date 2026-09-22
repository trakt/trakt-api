import { afterEach, describe, expect, it, vi } from 'vitest';
vi.mock(
  '$env/static/public',
  () => ({ PUBLIC_GITHUB_CLIENT_ID: 'test-client' }),
);
import {
  completeGithubConnect,
  githubConnectUrl,
  isGithubCallback,
  takeGithubCode,
  takeGithubDraft,
} from './githubConnect.ts';

const DRAFT = {
  name: 'My App',
  description: 'Half typed',
  redirects: 'https://example.com/callback',
  origins: '',
};

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
  it('builds the authorize url and stashes state and return path', () => {
    const storage = fakeStorage();
    vi.stubGlobal('sessionStorage', storage);
    vi.stubGlobal('location', { origin: 'https://developer.trakt.tv' });
    vi.stubGlobal('crypto', { randomUUID: () => 'fixed-state' });
    const url = new URL(githubConnectUrl('/apps/new', DRAFT));
    expect(url.origin + url.pathname).toBe(
      'https://github.com/login/oauth/authorize',
    );
    expect(url.searchParams.get('client_id')).toBe('test-client');
    expect(url.searchParams.get('redirect_uri')).toBe(
      'https://developer.trakt.tv/apps',
    );
    expect(url.searchParams.get('state')).toBe('fixed-state');
    expect(storage.getItem('trakt-developer-github-state')).toBe(
      'fixed-state',
    );
    expect(storage.getItem('trakt-developer-github-return')).toBe(
      '/apps/new',
    );
    expect(storage.getItem('trakt-developer-github-draft')).toBe(
      JSON.stringify(DRAFT),
    );
  });
});

describe('takeGithubDraft', () => {
  it('restores the draft the user had typed before the redirect', () => {
    const storage = fakeStorage();
    vi.stubGlobal('sessionStorage', storage);
    vi.stubGlobal('location', { origin: 'https://developer.trakt.tv' });
    vi.stubGlobal('crypto', { randomUUID: () => 'fixed-state' });
    githubConnectUrl('/apps/new', DRAFT);
    expect(takeGithubDraft()).toEqual(DRAFT);
    expect(takeGithubDraft()).toBeNull();
  });
  it('drops a draft that is not readable', () => {
    const storage = fakeStorage();
    storage.setItem('trakt-developer-github-draft', 'not-json');
    vi.stubGlobal('sessionStorage', storage);
    expect(takeGithubDraft()).toBeNull();
  });
  it('drops a draft whose fields are the wrong shape', () => {
    const storage = fakeStorage();
    storage.setItem(
      'trakt-developer-github-draft',
      JSON.stringify({ ...DRAFT, name: 42 }),
    );
    vi.stubGlobal('sessionStorage', storage);
    expect(takeGithubDraft()).toBeNull();
  });
});

describe('completeGithubConnect', () => {
  it('accepts a matching state, stashes the code and ignores unknown params', () => {
    const storage = fakeStorage();
    storage.setItem('trakt-developer-github-state', 'expected-state');
    storage.setItem('trakt-developer-github-return', '/apps/new');
    vi.stubGlobal('sessionStorage', storage);
    const params = new URLSearchParams({
      code: 'abc',
      state: 'expected-state',
      iss: 'https://github.com/login/oauth',
    });
    expect(completeGithubConnect(params)).toEqual({
      status: 'connected',
      returnPath: '/apps/new',
    });
    expect(storage.getItem('trakt-developer-github-code')).toBe('abc');
    expect(storage.getItem('trakt-developer-github-state')).toBeNull();
  });
  it('rejects a mismatched state', () => {
    const storage = fakeStorage();
    storage.setItem('trakt-developer-github-state', 'expected-state');
    vi.stubGlobal('sessionStorage', storage);
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
  it('refuses a return path that is not a portal route', () => {
    const storage = fakeStorage();
    storage.setItem('trakt-developer-github-state', 'expected-state');
    storage.setItem(
      'trakt-developer-github-return',
      'https://evil.example.com',
    );
    vi.stubGlobal('sessionStorage', storage);
    expect(
      completeGithubConnect(
        new URLSearchParams({ code: 'abc', state: 'expected-state' }),
      ),
    ).toEqual({ status: 'connected', returnPath: '/' });
  });
  it('reports a denial callback and clears the pending state', () => {
    const storage = fakeStorage();
    storage.setItem('trakt-developer-github-state', 'expected-state');
    storage.setItem('trakt-developer-github-return', '/apps/new');
    storage.setItem('trakt-developer-github-draft', JSON.stringify(DRAFT));
    vi.stubGlobal('sessionStorage', storage);
    const params = new URLSearchParams({
      error: 'access_denied',
      error_description: 'The user has denied your application access.',
      state: 'expected-state',
    });
    expect(completeGithubConnect(params)).toEqual({ status: 'denied' });
    expect(storage.getItem('trakt-developer-github-state')).toBeNull();
    expect(storage.getItem('trakt-developer-github-return')).toBeNull();
    expect(storage.getItem('trakt-developer-github-code')).toBeNull();
    expect(storage.getItem('trakt-developer-github-draft')).toBeNull();
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

describe('takeGithubCode', () => {
  it('reads and clears the stashed code', () => {
    const storage = fakeStorage();
    storage.setItem('trakt-developer-github-code', 'abc');
    vi.stubGlobal('sessionStorage', storage);
    expect(takeGithubCode()).toBe('abc');
    expect(takeGithubCode()).toBeNull();
  });
});
