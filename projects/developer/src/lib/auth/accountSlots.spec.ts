import { describe, expect, it } from 'vitest';
import { ACCOUNT_LIMIT } from './ACCOUNT_LIMIT.ts';
import { fallbackUsername } from './fallbackUsername.ts';
import { isAccountSlot } from './isAccountSlot.ts';

describe('account slots', () => {
  it.each([0, 1, ACCOUNT_LIMIT - 1])('accepts slot %i', (slot) => {
    expect(isAccountSlot(slot)).toBe(true);
  });

  it.each([-1, ACCOUNT_LIMIT, 1.5, Number.NaN])(
    'rejects %s',
    (slot) => expect(isAccountSlot(slot)).toBe(false),
  );

  it('numbers the fallback username from one', () => {
    expect(fallbackUsername(0)).toBe('Account 1');
    expect(fallbackUsername(4)).toBe('Account 5');
  });
});
