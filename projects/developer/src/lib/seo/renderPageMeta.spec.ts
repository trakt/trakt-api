import { describe, expect, it } from 'vitest';
import { renderPageMeta } from './renderPageMeta.ts';

const META = {
  title: 'Dates & "Times" <UTC>',
  description: 'All dates are UTC.',
  canonical: 'https://developer.trakt.tv/docs/dates',
  indexable: true,
};

describe('renderPageMeta', () => {
  it('escapes values and links the canonical URL', () => {
    const html = renderPageMeta(META);

    expect(html).toContain(
      '<title>Dates &amp; &quot;Times&quot; &lt;UTC&gt;</title>',
    );
    expect(html).toContain(
      '<link rel="canonical" href="https://developer.trakt.tv/docs/dates" />',
    );
    expect(html).not.toContain('noindex');
  });

  it('marks private pages noindex instead of canonical', () => {
    const html = renderPageMeta({ ...META, indexable: false });

    expect(html).toContain('<meta name="robots" content="noindex" />');
    expect(html).not.toContain('rel="canonical"');
  });
});
