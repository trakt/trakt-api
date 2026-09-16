import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import {
  rememberSection,
  rememberSlot,
  selectedSlot,
  takeReturnPath,
} from './accountNavigation.ts';
beforeEach(() => {
  const values = new Map<string, string>();
  vi.stubGlobal('sessionStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  });
});
afterEach(() => vi.unstubAllGlobals());
it('restores account selection without storing tokens', () => {
  expect(selectedSlot()).toBeNull();
  rememberSlot(3);
  expect(selectedSlot()).toBe(3);
  rememberSlot(8);
  expect(selectedSlot()).toBeNull();
});
it('preserves only an allowlisted section after OAuth, never request parameters', () => {
  vi.stubGlobal('location', {
    href: 'https://developer.trakt.tv/?section=apps&secret=private#private',
  });
  rememberSection();
  expect(takeReturnPath()).toBe('/apps');
  expect(takeReturnPath()).toBe('/');
  vi.stubGlobal('location', {
    href: 'https://developer.trakt.tv/?section=https://evil.example',
  });
  rememberSection();
  expect(takeReturnPath()).toBe('/');
});

it.each(['/apps', '/apps/new', '/apps/42', '/apps/42/edit'])(
  'restores the app route %s after OAuth',
  (path) => {
    vi.stubGlobal('location', {
      href: `https://developer.trakt.tv${path}?secret=private#private`,
    });
    rememberSection();
    expect(takeReturnPath()).toBe(path);
  },
);
it.each(['/apps/../callback', '/apps/42/delete', '//evil.example/apps'])(
  'rejects unsupported return path %s',
  (path) => {
    globalThis.sessionStorage.setItem('trakt-developer-return-section', path);
    expect(takeReturnPath()).toBe('/');
  },
);
