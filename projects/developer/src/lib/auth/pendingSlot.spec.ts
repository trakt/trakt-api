import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { takePendingSlot, writePendingSlot } from './pendingSlot.ts';

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    removeItem: (key: string) => void values.delete(key),
  };
}

beforeEach(() => vi.stubGlobal('sessionStorage', memoryStorage()));

afterEach(() => vi.unstubAllGlobals());

describe('pending slot', () => {
  it('returns the slot that started the sign-in', () => {
    writePendingSlot(3);
    expect(takePendingSlot()).toBe(3);
  });

  it('clears the slot so a replayed callback cannot reuse it', () => {
    writePendingSlot(2);
    takePendingSlot();
    expect(takePendingSlot()).toBeNull();
  });

  it('returns null when no sign-in is pending', () => {
    expect(takePendingSlot()).toBeNull();
  });

  it('rejects a slot outside the supported range', () => {
    globalThis.sessionStorage.setItem('trakt-developer-pending-slot', '9');
    expect(takePendingSlot()).toBeNull();
  });
});
