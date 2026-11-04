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
});
