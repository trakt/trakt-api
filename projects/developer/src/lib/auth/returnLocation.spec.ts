import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { takeReturnLocation, writeReturnLocation } from './returnLocation.ts';

const KEY = 'trakt-developer-return-to';

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    removeItem: (key: string) => void values.delete(key),
  };
}

function atLocation(
  { pathname = '/', search = '', hash = '' }: Partial<Location>,
) {
  vi.stubGlobal('location', { pathname, search, hash });
}

beforeEach(() => {
  vi.stubGlobal('sessionStorage', memoryStorage());
  atLocation({});
});
afterEach(() => vi.unstubAllGlobals());

describe('return location', () => {
  it('returns to the root when nothing was stored', () => {
    expect(takeReturnLocation()).toBe('/');
  });

  it('keeps the query string, which carries the selected section', () => {
    atLocation({ pathname: '/', search: '?section=reference' });
    writeReturnLocation();
    expect(takeReturnLocation()).toBe('/?section=reference');
  });

  it('keeps the hash, which carries the request state', () => {
    atLocation({
      pathname: '/',
      search: '?section=reference',
      hash: '#v=1&endpoint=getRecommendationsMoviesRecommend&tab=params',
    });
    writeReturnLocation();
    expect(takeReturnLocation()).toBe(
      '/?section=reference#v=1&endpoint=getRecommendationsMoviesRecommend&tab=params',
    );
  });

  it('clears the value so a later sign-in does not reuse it', () => {
    atLocation({ pathname: '/', search: '?section=guides' });
    writeReturnLocation();
    takeReturnLocation();
    expect(takeReturnLocation()).toBe('/');
  });

  it.each([
    ['//evil.example.com', 'a protocol-relative host'],
    ['https://evil.example.com', 'an absolute url'],
    ['javascript:alert(1)', 'a script url'],
    ['', 'an empty value'],
  ])('refuses %s (%s)', (stored) => {
    globalThis.sessionStorage.setItem(KEY, stored);
    expect(takeReturnLocation()).toBe('/');
  });
});
