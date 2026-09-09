import { describe, expect, it } from 'vitest';
import { publicOrigin } from './publicOrigin.ts';

describe('publicOrigin', () => {
  it('should require HTTPS for a configured deployment origin', () => {
    expect(() =>
      publicOrigin({
        configuredOrigin: 'http://developer.trakt.tv',
        requestUrl: new URL('https://developer.trakt.tv/auth/login'),
      })
    ).toThrow('DEVELOPER_ORIGIN must use HTTPS.');
  });

  it('should accept the local request origin during development', () => {
    expect(publicOrigin({
      configuredOrigin: undefined,
      requestUrl: new URL('http://localhost:5174/auth/login'),
    })).toBe('http://localhost:5174');
  });
});
