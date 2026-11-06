import { describe, expect, it } from 'vitest';
import { parseApplication } from './parseApplication.ts';

describe('V3 application validation parity', () => {
  it('accepts native callbacks and OOB, trims fields and canonicalizes origins', () => {
    expect(
      parseApplication({
        name: ' My App ',
        description: ' Description ',
        redirects: 'myapp://callback\nurn:ietf:wg:oauth:2.0:oob',
        originsText: 'https://EXAMPLE.com:443/',
      }),
    ).toEqual({
      name: 'My App',
      description: 'Description',
      redirect_uri: ['myapp://callback', 'urn:ietf:wg:oauth:2.0:oob'],
      origins: ['https://example.com'],
      dev: false,
    });
  });

  it.each([
    'javascript:alert(1)',
    'data:text/plain,hello',
    'vbscript:msgbox(1)',
    'blob:https://example.com/callback',
    'https://example.com/?code=x',
    'https://example.com/#fragment',
  ])('rejects unsafe or unsupported callback %s', (uri) => {
    expect(() =>
      parseApplication({
        name: 'App',
        description: '',
        redirects: uri,
        originsText: '',
        dev: true,
      }),
    ).toThrow();
  });

  it.each([
    'https://*.example.com',
    'https://example.com/path',
    'https://user:pass@example.com',
    'myapp://callback',
  ])('rejects invalid origin %s', (origin) => {
    expect(() =>
      parseApplication({
        name: 'App',
        description: '',
        redirects: 'myapp://callback',
        originsText: origin,
      }),
    ).toThrow();
  });

  it('enforces required fields and combined limits', () => {
    expect(() =>
      parseApplication({
        name: ' ',
        description: '',
        redirects: 'myapp://callback',
        originsText: '',
      }),
    ).toThrow();
    expect(() =>
      parseApplication({
        name: 'App',
        description: '',
        redirects: '',
        originsText: '',
      }),
    ).toThrow();
    expect(() =>
      parseApplication({
        name: 'App',
        description: 'x'.repeat(256),
        redirects: 'myapp://callback',
        originsText: '',
      }),
    ).toThrow();
    expect(() =>
      parseApplication({
        name: 'App',
        description: '',
        redirects: Array(26).fill('myapp://callback').join('\n'),
        originsText: '',
      }),
    ).toThrow();
    expect(() =>
      parseApplication({
        name: 'App',
        description: '',
        redirects: 'https://example.com/' + 'x'.repeat(2048),
        originsText: '',
      }),
    ).toThrow();
    expect(() =>
      parseApplication({
        name: 'App',
        description: '',
        redirects: 'myapp://callback',
        originsText: Array(25).fill('https://example.com').join('\n'),
      }),
    ).toThrow();
  });

  it('accepts hosted and native callbacks on a development app', () => {
    const redirects =
      'http://localhost:5173/callback\nhttps://you.github.io/app/\nmyapp://callback\ncom.example.app:/oauth';

    expect(
      parseApplication({
        name: 'Dev App',
        description: '',
        originsText: '',
        redirects,
        dev: true,
      }).redirect_uri,
    ).toEqual(redirects.split('\n'));
  });

  it('holds new or edited production redirects to public https', () => {
    const base = { name: 'App', description: '', originsText: '' };

    expect(() =>
      parseApplication({
        ...base,
        redirects:
          'https://example.com/cb\nmyapp://callback\nhttp://localhost:5173',
        enforceProductionRedirects: true,
      }),
    ).toThrow(
      'Production redirect URIs must use https:// on a domain you control. Change myapp://callback, http://localhost:5173.',
    );
    expect(
      parseApplication({
        ...base,
        redirects: 'myapp://callback',
        enforceProductionRedirects: false,
      }).redirect_uri,
    ).toEqual(['myapp://callback']);
  });

  it('lets a read-only Production app save without a redirect', () => {
    const base = {
      name: 'Poster Wall',
      description: '',
      redirects: '',
      originsText: '',
    };

    expect(() => parseApplication(base)).toThrow('Enter 1-25 redirect URIs');
    expect(
      parseApplication({ ...base, redirectsOptional: true }).redirect_uri,
    ).toEqual([]);
  });
});
