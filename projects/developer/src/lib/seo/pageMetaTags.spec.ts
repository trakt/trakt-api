import { describe, expect, it } from 'vitest';
import { PAGE_META_KEYS } from './PAGE_META_KEYS.ts';
import { pageMetaTags } from './pageMetaTags.ts';

const META = {
  title: 'Dates | Trakt API Guides',
  description: 'All dates are UTC.',
  canonical: 'https://developer.trakt.tv/docs/dates',
  indexable: true,
};

function keys(indexable: boolean): Array<string> {
  return pageMetaTags({ ...META, indexable }).map(({ key }) => key.value);
}

describe('pageMetaTags', () => {
  it('links the canonical URL of an indexable page', () => {
    expect(keys(true)).toContain('canonical');
    expect(keys(true)).not.toContain('robots');
  });

  it('marks a private page noindex instead of canonical', () => {
    expect(keys(false)).toContain('robots');
    expect(keys(false)).not.toContain('canonical');
  });

  it('only emits tags it knows how to remove again', () => {
    const known = PAGE_META_KEYS.map(({ value }) => value);

    for (const key of [...keys(true), ...keys(false)]) {
      expect(known).toContain(key);
    }
  });
});
