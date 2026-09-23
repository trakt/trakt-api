import { describe, expect, it } from 'vitest';
import { parseAccountSlot } from './parseAccountSlot.ts';

describe('parse account slot', () => {
  it('returns null when the value is absent', () => {
    expect(parseAccountSlot(null)).toBeNull();
  });

  it('parses an empty string as slot 0', () => {
    expect(parseAccountSlot('')).toBe(0);
  });

  it('rejects a non-numeric value', () => {
    expect(parseAccountSlot('abc')).toBeNull();
  });

  it('rejects a slot outside the supported range', () => {
    expect(parseAccountSlot('-1')).toBeNull();
    expect(parseAccountSlot('9')).toBeNull();
  });

  it('parses a slot within the supported range', () => {
    expect(parseAccountSlot('0')).toBe(0);
    expect(parseAccountSlot('3')).toBe(3);
  });
});
