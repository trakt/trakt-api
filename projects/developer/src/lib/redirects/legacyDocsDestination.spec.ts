import { describe, expect, it } from 'vitest';
import contents from '$lib/guides/contents.md?raw';
import { parseGuideContents } from '$lib/guides/parseGuideContents.ts';
import guideRedirects from './guideRedirects.json' with { type: 'json' };
import { legacyDocsDestination } from './legacyDocsDestination.ts';

const GUIDES = parseGuideContents(contents).flatMap((group) => group.items);

describe('legacyDocsDestination', () => {
  it('maps the public docs pages to their guides', () => {
    const guides = GUIDES.filter(({ slug }) => !slug.startsWith('about-'));

    expect(guides).toHaveLength(24);

    for (const { slug } of guides) {
      expect(legacyDocsDestination(`/docs/${slug}`)).toBe(
        `/?section=guides&guide=${slug}`,
      );
    }
  });

  it('only maps to guides listed in the portal', () => {
    const slugs = new Set(GUIDES.map(({ slug }) => slug));

    for (const slug of Object.values(guideRedirects)) {
      expect(slugs.has(slug)).toBe(true);
    }
  });

  it.each([
    [
      '/docs/caching-and-fresh-metadata',
      '/?section=guides&guide=caching-and-fresh-data',
    ],
    ['/docs/limited-access', '/?section=guides&guide=limted-access'],
    ['/docs', '/?section=guides'],
  ])('maps %s to its destination', (path, destination) => {
    for (const suffix of ['', '/', '.md', '.md/']) {
      expect(legacyDocsDestination(`${path}${suffix}`)).toBe(destination);
    }
  });

  it.each([
    '/',
    '/missing',
    '/docs/missing',
    '/reference/missing',
    '/reference',
    '/reference/auth',
    '/reference/about-scrobble',
    '/reference/postoauthtoken',
    '/docs/constructor',
  ])(
    'sends unknown path %s to the homepage',
    (path) => {
      expect(legacyDocsDestination(path)).toBe('/');
    },
  );
});
