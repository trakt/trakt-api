import { describe, expect, it } from 'vitest';
import { matchUsernames } from './matchUsernames.ts';

const people = [
  { username: 'seftur', slug: 'seftur' },
  { username: 'sefertrakt', slug: 'sefertrakt' },
  { username: 'justin', slug: 'justin' },
  { username: 'Andrei L. Magnea', slug: 'andrei-l-magnea' },
];

describe('matchUsernames', () => {
  it('lists prefix matches before other matches, ignoring case', () => {
    expect(matchUsernames(people, 'SEF', new Set()).map((p) => p.slug))
      .toEqual(['seftur', 'sefertrakt']);
    expect(matchUsernames(people, 'magnea', new Set()).map((p) => p.slug))
      .toEqual(['andrei-l-magnea']);
  });

  it('leaves out people who are already members', () => {
    expect(
      matchUsernames(people, 'sef', new Set(['seftur'])).map((p) => p.slug),
    ).toEqual(['sefertrakt']);
  });

  it('suggests nothing for an empty query', () => {
    expect(matchUsernames(people, '  ', new Set())).toEqual([]);
  });
});
