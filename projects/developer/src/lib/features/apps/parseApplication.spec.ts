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
    });
  });

  it.each([
    'javascript:alert(1)',
    'data:text/plain,hello',
    'https://example.com/?code=x',
    'https://example.com/#fragment',
  ])('rejects unsafe or unsupported callback %s', (uri) => {
    expect(() =>
      parseApplication({
        name: 'App',
        description: '',
        redirects: uri,
        originsText: '',
      })
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
      })
    ).toThrow();
  });

  it('enforces required fields and combined limits', () => {
    expect(() =>
      parseApplication({
        name: ' ',
        description: '',
        redirects: 'myapp://callback',
        originsText: '',
      })
    ).toThrow();
    expect(() =>
      parseApplication({
        name: 'App',
        description: '',
        redirects: '',
        originsText: '',
      })
    ).toThrow();
    expect(() =>
      parseApplication({
        name: 'App',
        description: 'x'.repeat(256),
        redirects: 'myapp://callback',
        originsText: '',
      })
    ).toThrow();
    expect(() =>
      parseApplication({
        name: 'App',
        description: '',
        redirects: Array(26).fill('myapp://callback').join('\n'),
        originsText: '',
      })
    ).toThrow();
    expect(() =>
      parseApplication({
        name: 'App',
        description: '',
        redirects: 'https://example.com/' + 'x'.repeat(2048),
        originsText: '',
      })
    ).toThrow();
    expect(() =>
      parseApplication({
        name: 'App',
        description: '',
        redirects: 'myapp://callback',
        originsText: Array(25).fill('https://example.com').join('\n'),
      })
    ).toThrow();
  });
});
