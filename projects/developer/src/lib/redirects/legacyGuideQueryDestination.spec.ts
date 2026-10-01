import { describe, expect, it } from 'vitest';
import { legacyGuideQueryDestination } from './legacyGuideQueryDestination.ts';

function destination(search: string): string | null {
  return legacyGuideQueryDestination(
    new URL(`https://developer.trakt.tv/${search}`),
  );
}

describe('legacyGuideQueryDestination', () => {
  it('sends an old guide query link to its guide page', () => {
    expect(destination('?section=guides&guide=api-url')).toBe('/docs/api-url');
  });

  it.each([
    '',
    '?section=guides',
    '?section=reference&guide=api-url',
    '?section=guides&guide=../callback',
    '?section=guides&guide=a%2Fb',
  ])('leaves %s on the homepage', (search) => {
    expect(destination(search)).toBeNull();
  });
});
