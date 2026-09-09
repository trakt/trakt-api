import { describe, expect, it } from 'vitest';
import { getHttpStatusMeaning } from './getHttpStatusMeaning.ts';

describe('getHttpStatusMeaning', () => {
  it('should return standard meanings for documented response codes', () => {
    expect(getHttpStatusMeaning('200')).toBe('OK');
    expect(getHttpStatusMeaning('204')).toBe('No Content');
    expect(getHttpStatusMeaning('400')).toBe('Bad Request');
    expect(getHttpStatusMeaning('404')).toBe('Not Found');
  });

  it('should leave non-numeric OpenAPI response keys unlabeled', () => {
    expect(getHttpStatusMeaning('default')).toBe('');
  });
});
