import { describe, expect, it } from 'vitest';
import { pageMeta } from './pageMeta.ts';

describe('pageMeta', () => {
  it('describes a guide page with its own title and canonical URL', () => {
    const meta = pageMeta('/docs/api-url');

    expect(meta.title).toBe('API URL | Trakt API Guides');
    expect(meta.description).toBe(
      'The API should always be accessed over SSL.',
    );
    expect(meta.canonical).toBe('https://developer.trakt.tv/docs/api-url');
    expect(meta.indexable).toBe(true);
  });

  it('uses the portal defaults for the homepage', () => {
    expect(pageMeta('/')).toMatchObject({
      canonical: 'https://developer.trakt.tv/',
      indexable: true,
    });
  });

  it.each(['/apps', '/apps/42/edit', '/callback', '/[fallback]', '/docs/x'])(
    'keeps %s out of search results',
    (path) => {
      expect(pageMeta(path).indexable).toBe(false);
    },
  );
});
