import { describe, expect, it } from 'vitest';
import { parseApplication } from './validateApplication.ts';
describe('V3 application validation parity', () => {
  it('accepts native callbacks and OOB, trims fields and canonicalizes origins', () => {
    expect(
      parseApplication(
        ' My App ',
        ' Description ',
        'myapp://callback\nurn:ietf:wg:oauth:2.0:oob',
        'https://EXAMPLE.com:443/',
      ),
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
    expect(() => parseApplication('App', '', uri, '')).toThrow();
  });
  it.each([
    'https://*.example.com',
    'https://example.com/path',
    'https://user:pass@example.com',
    'myapp://callback',
  ])('rejects invalid origin %s', (origin) => {
    expect(() => parseApplication('App', '', 'myapp://callback', origin))
      .toThrow();
  });
  it('carries the github code through when present', () => {
    expect(
      parseApplication('App', '', 'myapp://callback', '', 'abc123'),
    ).toEqual({
      name: 'App',
      description: undefined,
      redirect_uri: ['myapp://callback'],
      origins: [],
      github_code: 'abc123',
    });
  });
  it('enforces required fields and combined limits', () => {
    expect(() => parseApplication(' ', '', 'myapp://callback', '')).toThrow();
    expect(() => parseApplication('App', '', '', '')).toThrow();
    expect(() =>
      parseApplication('App', 'x'.repeat(256), 'myapp://callback', '')
    ).toThrow();
    expect(() =>
      parseApplication(
        'App',
        '',
        Array(26).fill('myapp://callback').join('\n'),
        '',
      )
    ).toThrow();
    expect(() =>
      parseApplication('App', '', 'https://example.com/' + 'x'.repeat(2048), '')
    ).toThrow();
    expect(() =>
      parseApplication(
        'App',
        '',
        'myapp://callback',
        Array(25).fill('https://example.com').join('\n'),
      )
    ).toThrow();
  });
});
