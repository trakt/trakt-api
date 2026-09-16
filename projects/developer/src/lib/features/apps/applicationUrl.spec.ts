import { expect, it } from 'vitest';
import { applicationUrl } from './applicationUrl.ts';
it('carries app names through detail and edit links without adding query parameters', () => {
  const name = 'Movies & TV / 日本語 #1?secret=no';
  for (const edit of [false, true]) {
    const url = new URL(
      applicationUrl(42, name, edit),
      'https://developer.trakt.tv',
    );
    expect(url.pathname).toBe(edit ? '/apps/42/edit' : '/apps/42');
    expect([...url.searchParams]).toEqual([['name', name]]);
    expect(url.hash).toBe('');
  }
});
it('supports unnamed deep links and the list fallback', () => {
  expect(applicationUrl(42)).toBe('/apps/42');
  expect(applicationUrl(undefined, 'App')).toBe('/apps');
});
