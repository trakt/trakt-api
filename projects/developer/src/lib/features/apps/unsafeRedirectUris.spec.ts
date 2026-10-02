import { describe, expect, it } from 'vitest';
import { unsafeRedirectUris } from './unsafeRedirectUris.ts';

describe('unsafeRedirectUris', () => {
  it('accepts public https redirect URIs', () => {
    expect(
      unsafeRedirectUris(
        'https://example.com/callback\nhttps://app.example.com/auth',
      ),
    ).toEqual([]);
  });

  it('accepts public addresses next to the private ranges', () => {
    expect(
      unsafeRedirectUris(
        [
          'https://172.15.0.1/callback',
          'https://172.32.0.1/callback',
          'https://11.0.0.1/callback',
          'https://[2001:db8::1]/callback',
          'https://localhost.example.com/callback',
        ].join('\n'),
      ),
    ).toEqual([]);
  });

  it.each([
    'myapp://callback',
    'com.example.app:/oauth',
    'urn:ietf:wg:oauth:2.0:oob',
    'http://example.com/callback',
    'https://localhost:3000/callback',
    'http://localhost/callback',
    'https://dev.localhost/callback',
    'http://127.0.0.1:8080/callback',
    'http://[::1]/callback',
    'https://0.0.0.0/callback',
    'https://10.0.0.1/callback',
    'https://172.16.4.2/callback',
    'https://172.31.255.1/callback',
    'https://192.168.1.10/callback',
    'https://169.254.10.20/callback',
    'https://[fd12:3456::1]/callback',
    'https://[fc00::1]/callback',
    'https://[fe80::1]/callback',
    'https://printer.local/callback',
  ])('flags %s', (uri) => {
    expect(unsafeRedirectUris(uri)).toEqual([uri]);
  });

  it('returns only the unsafe lines, trimmed, and skips blank lines', () => {
    expect(
      unsafeRedirectUris(
        ' https://example.com/callback \n\n myapp://callback \n',
      ),
    ).toEqual(['myapp://callback']);
  });

  it('lists a repeated unsafe URI once', () => {
    expect(unsafeRedirectUris('myapp://callback\nmyapp://callback')).toEqual([
      'myapp://callback',
    ]);
  });
});
