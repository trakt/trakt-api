import { describe, expect, it } from 'vitest';
import { nonLocalRedirectUris } from './nonLocalRedirectUris.ts';

describe('nonLocalRedirectUris', () => {
  it('accepts localhost, 127.0.0.1 and [::1] on any port', () => {
    expect(
      nonLocalRedirectUris(
        'http://localhost:5173/callback\nhttp://127.0.0.1:4173\nhttp://[::1]:8080/cb',
      ),
    ).toEqual([]);
  });

  it('lists each non-local redirect once', () => {
    expect(
      nonLocalRedirectUris(
        'http://localhost:5173/callback\nhttps://example.com/cb\ntrakt://auth\nhttps://example.com/cb',
      ),
    ).toEqual(['https://example.com/cb', 'trakt://auth']);
  });
});
