import { describe, expect, it } from 'vitest';
import { productionReviewIssues } from './productionReviewIssues.ts';

const answers = {
  signIn: 'pkce' as const,
  redirectsNeeded: true,
  redirects: 'https://example.app/callback',
  needsSecret: false,
  secretReason: '',
  confirmPolicy: true,
  confirmSecret: false,
  hasClientSecret: false,
};

describe('productionReviewIssues', () => {
  it('finds nothing in complete answers', () => {
    expect(productionReviewIssues(answers)).toEqual([]);
  });

  it('lists every field with a problem, in form order', () => {
    const issues = productionReviewIssues({
      ...answers,
      redirects: 'myapp://callback',
      needsSecret: true,
      confirmPolicy: false,
    });

    expect(issues.map((issue) => issue.field)).toEqual([
      'redirects',
      'secretReason',
      'confirmPolicy',
      'confirmSecret',
    ]);
  });

  it.each([
    ['https://example.app/callback?next=home', /queries or fragments/],
    ['https://example.app/callback#home', /queries or fragments/],
    ['https://example.app/my callback', /whitespace/],
    [
      Array.from({ length: 26 }, (_, i) => `https://example.app/${i}`).join(
        '\n',
      ),
      /1-25/,
    ],
    [`https://example.app/${'a'.repeat(2048)}`, /2,048/],
  ])('flags invalid callback lists before submission', (redirects, message) => {
    expect(productionReviewIssues({ ...answers, redirects })).toEqual([
      { field: 'redirects', message: expect.stringMatching(message) },
    ]);
  });

  it('skips redirects and the Client Secret for apps that only read public data', () => {
    expect(
      productionReviewIssues({
        ...answers,
        signIn: 'none',
        redirects: '',
        needsSecret: true,
      }),
    ).toEqual([]);
  });
});
