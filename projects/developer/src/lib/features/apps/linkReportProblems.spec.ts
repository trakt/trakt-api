import { describe, expect, it } from 'vitest';
import type { LinkReport } from './LinkReport.ts';
import { linkReportProblems } from './linkReportProblems.ts';

const healthy: LinkReport = {
  links: [
    { field: 'product_links', url: 'https://app.io', state: 'ok' },
    { field: 'privacy_url', url: 'https://app.io/privacy', state: 'ok' },
    { field: 'notice_links', url: 'https://app.io/about', state: 'ok' },
  ],
  notice_found: true,
  privacy_mentions_trakt: true,
};

describe('linkReportProblems', () => {
  it('finds nothing in a healthy report', () => {
    expect(linkReportProblems(healthy, 'Showlist')).toEqual({
      blocking: [],
      warnings: [],
    });
  });

  it('blocks on each dead link once and lets unconfirmed links through', () => {
    const { blocking } = linkReportProblems(
      {
        ...healthy,
        links: [
          { field: 'product_links', url: 'https://gone.io', state: 'dead' },
          { field: 'notice_links', url: 'https://gone.io', state: 'dead' },
          {
            field: 'privacy_url',
            url: 'https://wall.io',
            state: 'unconfirmed',
          },
        ],
      },
      'Showlist',
    );

    expect(blocking).toHaveLength(1);
    expect(blocking[0]).toContain('https://gone.io');
  });

  it('warns about a missing notice and a privacy page without Trakt', () => {
    const { blocking, warnings } = linkReportProblems(
      { ...healthy, notice_found: false, privacy_mentions_trakt: false },
      'Showlist',
    );

    expect(blocking).toEqual([]);
    expect(warnings).toHaveLength(2);
    expect(warnings[0]).toContain('Showlist uses Trakt');
  });

  it('stays quiet when the pages could not be read', () => {
    expect(
      linkReportProblems(
        { ...healthy, notice_found: null, privacy_mentions_trakt: null },
        'Showlist',
      ).warnings,
    ).toEqual([]);
  });

  it('says a person will look when the proof is an image or a video', () => {
    const { blocking, warnings } = linkReportProblems(
      { ...healthy, notice_found: null, notice_is_media: true },
      'Showlist',
    );

    expect(blocking).toEqual([]);
    expect(warnings).toEqual([expect.stringMatching(/image or a video/)]);
  });
});
