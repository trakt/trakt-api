import { describe, expect, it } from 'vitest';
import { formatTokenValidity } from './formatTokenValidity.ts';

describe('token validity', () => {
  it.each([
    [0, 'Expired'],
    [-1, 'Expired'],
    [1, '1s'],
    [59, '59s'],
    [60, '1m'],
    [61, '1m 1s'],
    [3600, '1h'],
    [3661, '1h 1m'],
    [86400, '1d'],
    [90061, '1d 1h'],
    [86401, '1d 1s'],
    [Number.NaN, 'Unknown'],
  ])('formats %s seconds as %s', (remaining, expected) => {
    expect(formatTokenValidity(1000 + remaining, 1000000)).toBe(expected);
  });
});
