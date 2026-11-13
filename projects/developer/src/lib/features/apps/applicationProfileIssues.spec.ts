import { describe, expect, it } from 'vitest';
import type { ApplicationProfileDraft } from './ApplicationProfileDraft.ts';
import { applicationProfileIssues } from './applicationProfileIssues.ts';

const draft: ApplicationProfileDraft = {
  summary: 'a'.repeat(120),
  openSource: false,
  productLinks: 'https://example.app',
  privacyUrl: 'https://example.app/privacy',
  noticeLinks: 'https://example.app/about',
  expectedMau: '2000',
  signIn: 'pkce',
  writesUserData: true,
  usesOtherData: false,
  otherDataSources: '',
  syncsElsewhere: false,
  otherSyncServices: '',
};

describe('applicationProfileIssues', () => {
  it('finds nothing in a complete draft', () => {
    expect(applicationProfileIssues(draft)).toEqual([]);
  });

  it('lists every field with a problem, in form order', () => {
    const issues = applicationProfileIssues({
      ...draft,
      summary: 'Too short',
      privacyUrl: '',
      expectedMau: 'lots',
      syncsElsewhere: true,
    });

    expect(issues.map((issue) => issue.field)).toEqual([
      'summary',
      'privacyUrl',
      'expectedMau',
      'otherSyncServices',
    ]);
  });

  it('accepts the Workers limits and flags values just over them', () => {
    const link = (length: number) => 'https://example.app/'.padEnd(length, 'a');
    const atLimits = {
      ...draft,
      productLinks: link(2048),
      privacyUrl: link(500),
      noticeLinks: link(2048),
      expectedMau: '4294967295',
    };
    expect(applicationProfileIssues(atLimits)).toEqual([]);

    expect(
      applicationProfileIssues({
        ...atLimits,
        productLinks: link(2049),
        privacyUrl: link(501),
        noticeLinks: link(2049),
        expectedMau: '4294967296',
      }).map((issue) => issue.field),
    ).toEqual(['productLinks', 'privacyUrl', 'noticeLinks', 'expectedMau']);
  });

  it('ignores the other services fields while they are hidden', () => {
    expect(
      applicationProfileIssues({ ...draft, otherDataSources: 'x'.repeat(300) }),
    ).toEqual([]);
  });

  it.each([
    ['https://example.com', /can't review/],
    ['https://i.imgur.com/a.png', /can't review/],
    ['https://app.trakt.tv/about', /can't review/],
  ])('refuses %s as an app or notice link', (link, message) => {
    const issues = applicationProfileIssues({
      ...draft,
      productLinks: link,
      noticeLinks: link,
    });

    expect(issues.map((issue) => issue.field)).toEqual([
      'productLinks',
      'noticeLinks',
    ]);
    expect(issues[0]?.message).toMatch(message);
  });

  it.each([
    ['https://example.app/', /not your home page/],
    ['https://example.app/about/', /needs its own link/],
    ['https://Example.app', /not your home page/],
    ['http://localhost:3000/privacy', /can't review/],
  ])('refuses %s as the privacy link', (privacyUrl, message) => {
    const [issue] = applicationProfileIssues({ ...draft, privacyUrl });

    expect(issue?.field).toBe('privacyUrl');
    expect(issue?.message).toMatch(message);
  });

  it('accepts a privacy section that shares a page with the notice', () => {
    expect(
      applicationProfileIssues({
        ...draft,
        noticeLinks: 'https://example.app/privacy#trakt',
      }),
    ).toEqual([]);
  });

  it('keeps apps for 16 people or fewer on Development', () => {
    const [issue] = applicationProfileIssues({ ...draft, expectedMau: '16' });

    expect(issue?.message).toMatch(/stay on Development/);
    expect(applicationProfileIssues({ ...draft, expectedMau: '17' })).toEqual(
      [],
    );
  });
});
