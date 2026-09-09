import { describe, expect, it } from 'vitest';
import { renderMarkdown } from '../markdown/renderMarkdown.ts';
import { prepareGuideMarkdown } from './prepareGuideMarkdown.ts';
import { parseGuideContents } from './parseGuideContents.ts';

const files = import.meta.glob<string>('./*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const slugs = new Set(Object.keys(files).map((path) => path.slice(2, -3)));

describe('guide snapshots', () => {
  it('resolves known ReadMe operations locally and preserves other links', () => {
    const source = '[Token](https://docs.trakt.tv/reference/postoauthtoken) ' +
      '[Search](/reference/getsearchquery) [Auth](https://docs.trakt.tv/reference/auth)';
    const html = renderMarkdown(prepareGuideMarkdown(
      source,
      slugs,
      ['postOauthToken', 'getSearchQuery'],
    ));

    expect(html).toContain(
      'href="/?section=reference&amp;operation=postOauthToken"',
    );
    expect(html).toContain(
      'href="/?section=reference&amp;operation=getSearchQuery"',
    );
    expect(html).toContain('href="https://docs.trakt.tv/reference/auth"');
  });

  it('groups every guide and selects the first contents entry by default', () => {
    const groups = parseGuideContents(files['./contents.md']);
    expect(groups).toHaveLength(6);
    expect(groups[0].items[0].slug).toBe('getting-started');
    expect(
      groups.flatMap((group) => group.items.map((item) => item.slug)).sort(),
    )
      .toEqual([...slugs].filter((slug) => slug !== 'contents').sort());
  });

  it('lists every downloaded guide exactly once with a working local link', () => {
    const links = [...files['./contents.md'].matchAll(/guide=([\w-]+)/g)]
      .map((match) => match[1]);

    expect(links.sort()).toEqual(
      [...slugs].filter((slug) => slug !== 'contents').sort(),
    );
    expect(links).toHaveLength(28);
    for (const slug of links) {
      expect(files[`./${slug}.md`]).toMatch(/^# /m);
    }
  });

  it('renders plain Markdown guides and local links without export metadata', () => {
    for (const source of Object.values(files)) {
      const html = renderMarkdown(prepareGuideMarkdown(source, slugs));
      expect(html).not.toContain('updatedAt:');
      expect(html).not.toContain('Fetch the complete documentation index');
    }

    const table = renderMarkdown(
      prepareGuideMarkdown(files['./extended-info.md'], slugs),
    );
    expect(table).toContain('<table>');
    expect(table).toContain('<code>metadata</code>');
    expect(table).toContain(
      'href="/?section=guides&amp;guide=caching-and-fresh-data"',
    );

    const app = renderMarkdown(
      prepareGuideMarkdown(files['./create-an-app.md'], slugs),
    );
    expect(app).toContain('href="https://app.trakt.tv/settings/apps/api/new"');
  });
});
