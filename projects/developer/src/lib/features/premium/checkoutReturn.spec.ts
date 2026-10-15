import { describe, expect, it } from 'vitest';
import { checkoutReturn } from './checkoutReturn.ts';

describe('checkoutReturn', () => {
  it('reports a completed checkout with its session id', () => {
    expect(checkoutReturn(new URLSearchParams('session_id=cs_1'))).toEqual({
      kind: 'success',
      sessionId: 'cs_1',
    });
  });

  it('reports a cancelled checkout', () => {
    expect(checkoutReturn(new URLSearchParams('checkout=cancelled'))).toEqual({
      kind: 'cancelled',
    });
  });

  it('returns nothing on a plain visit', () => {
    expect(checkoutReturn(new URLSearchParams(''))).toBeNull();
    expect(checkoutReturn(new URLSearchParams('checkout=other'))).toBeNull();
  });
});
