import { afterEach, describe, expect, it, vi } from 'vitest';
import { completeGithubConnect } from './completeGithubConnect.ts';

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
