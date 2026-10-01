import { describe, expect, it } from 'vitest';
import { GUIDE_SOURCES } from './GUIDE_SOURCES.ts';
import { GUIDES } from './GUIDES.ts';
import { guideDescription } from './guideDescription.ts';

describe('guideDescription', () => {
  it('uses the first paragraph after the title as plain text', () => {
    const source = '---\nupdatedAt: 2026-01-01\n---\n\n# Title\n\n' +
      'Read the [**Extended Info**](/docs/extended-info) for `full` data.\n\n' +
      'Second paragraph.';

    expect(guideDescription(source)).toBe(
      'Read the Extended Info for full data.',
    );
  });

  it('skips headings, quotes, tables, lists, and code', () => {
    const source = '# Title\n\n#### Sub\n\n> Note\n\n| a |\n\n- item\n\n' +
      '```\ncode\n```\n\nThe real summary.';

    expect(guideDescription(source)).toBe('The real summary.');
  });

  it('shortens long paragraphs on a word boundary', () => {
    const description = guideDescription(`# Title\n\n${'word '.repeat(60)}`);

    expect(description?.length).toBeLessThanOrEqual(160);
    expect(description).toMatch(/word…$/);
  });

  it('returns nothing when the guide has no prose', () => {
    expect(guideDescription('# Title\n\n- only a list')).toBeNull();
  });

  it('finds a description for every listed guide', () => {
    for (const { slug } of GUIDES) {
      expect(guideDescription(GUIDE_SOURCES.get(slug) ?? '')).toBeTruthy();
    }
  });
});
