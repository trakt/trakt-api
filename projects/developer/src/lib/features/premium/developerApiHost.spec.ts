import { describe, expect, it } from 'vitest';
import { developerApiHost } from './developerApiHost.ts';

describe('developerApiHost', () => {
  it('keeps standard apps on the public host', () => {
    expect(developerApiHost('standard')).toBe('api.trakt.tv');
  });

  it('sends premium apps to apiz', () => {
    expect(developerApiHost('premium')).toBe('apiz.trakt.tv');
  });
});
