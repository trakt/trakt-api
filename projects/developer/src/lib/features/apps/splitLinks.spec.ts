import { describe, expect, it } from 'vitest';
import { splitLinks } from './splitLinks.ts';

describe('splitLinks', () => {
  it('splits on commas and new lines and trims each link', () => {
    expect(
      splitLinks(' https://a.example , https://b.example\nhttps://c.example '),
    ).toEqual(['https://a.example', 'https://b.example', 'https://c.example']);
  });

  it('drops blanks and duplicates while keeping the first order', () => {
    expect(
      splitLinks('https://a.example,, ,https://b.example,https://a.example'),
    ).toEqual(['https://a.example', 'https://b.example']);
  });

  it('returns nothing for an empty field', () => {
    expect(splitLinks('  \n , ')).toEqual([]);
  });
});
