import { describe, expect, it } from 'vitest';
import { formatRequestLine } from './formatRequestLine.ts';

describe('formatRequestLine', () => {
  it('should format the method and URL', () => {
    expect(formatRequestLine({
      method: 'GET',
      url: 'https://api.trakt.tv/movies/{id}',
    })).toBe('GET https://api.trakt.tv/movies/{id}');
  });

  it('should redact sensitive URL parameters', () => {
    expect(formatRequestLine({
      method: 'GET',
      url: 'https://api.trakt.tv/example?access_token=secret&extended=full',
    })).toBe(
      'GET https://api.trakt.tv/example?access_token=%5BREDACTED%5D&extended=full',
    );
  });
});
