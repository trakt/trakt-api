import { expect, it } from 'vitest';
import { applicationNameFrom, applicationUrl } from './applicationUrl.ts';

it('carries app names through detail and edit links without adding query parameters', () => {
  const name = 'Movies & TV / 日本語 #1?secret=no';
  for (const edit of [false, true]) {
    const url = new URL(
      applicationUrl({ id: 42, name, edit }),
      'https://developer.trakt.tv',
    );
    expect(url.pathname).toBe(edit ? '/apps/42/edit' : '/apps/42');
    expect([...url.searchParams]).toEqual([['name', name]]);
    expect(url.hash).toBe('');
  }
});

it('supports unnamed deep links and the list fallback', () => {
  expect(applicationUrl({ id: 42 })).toBe('/apps/42');
  expect(applicationUrl({ id: undefined, name: 'App' })).toBe('/apps');
});

it('reads back the name hint it writes, within the display limit', () => {
  const name = 'a'.repeat(300);
  const url = new URL(
    applicationUrl({ id: 42, name }),
    'https://developer.trakt.tv',
  );
  expect(applicationNameFrom(url)).toBe('a'.repeat(255));
  expect(applicationNameFrom(new URL('https://developer.trakt.tv/apps/42')))
    .toBeUndefined();
});
