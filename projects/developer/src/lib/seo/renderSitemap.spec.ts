import { describe, expect, it } from 'vitest';
import { renderSitemap } from './renderSitemap.ts';

describe('renderSitemap', () => {
  it('lists each page with its last modified date when known', () => {
    const xml = renderSitemap([
      { url: 'https://developer.trakt.tv/' },
      {
        url: 'https://developer.trakt.tv/docs/api-url',
        lastModified: '2026-07-30T13:20:49.000Z',
      },
    ]);

    expect(xml).toContain('<loc>https://developer.trakt.tv/</loc>\n  </url>');
    expect(xml).toContain(
      '<loc>https://developer.trakt.tv/docs/api-url</loc>\n' +
        '    <lastmod>2026-07-30T13:20:49.000Z</lastmod>',
    );
  });
});
