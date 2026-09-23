import { describe, expect, it } from 'vitest';
import { isGithubCallback } from './isGithubCallback.ts';

describe('isGithubCallback', () => {
  it('recognises both the code and the error callback', () => {
    expect(isGithubCallback(new URLSearchParams({ code: 'abc' }))).toBe(true);
    expect(isGithubCallback(new URLSearchParams({ error: 'access_denied' })))
      .toBe(true);
  });

  it('ignores a plain visit to the apps page', () => {
    expect(isGithubCallback(new URLSearchParams())).toBe(false);
  });
});
