import { describe, expect, it } from 'vitest';
import { resolveApiBaseUrl } from './resolveApiBaseUrl.ts';

describe('resolve api base url', () => {
  it.each([
    ['nothing is configured', undefined],
    ['the value is empty', ''],
    ['the value is only whitespace', '  '],
  ])('falls back to production when %s', (_, configured) => {
    expect(resolveApiBaseUrl(configured)).toBe('https://api.trakt.tv');
  });

  it('uses the configured url', () => {
    expect(resolveApiBaseUrl('http://localhost:8787')).toBe(
      'http://localhost:8787',
    );
  });

  it('drops trailing slashes so paths join cleanly', () => {
    expect(resolveApiBaseUrl('http://localhost:8787//')).toBe(
      'http://localhost:8787',
    );
  });
});
