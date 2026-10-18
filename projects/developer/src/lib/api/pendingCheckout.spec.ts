import { describe, expect, it } from 'vitest';
import { PENDING_CHECKOUT_KEY } from './PENDING_CHECKOUT_KEY.ts';
import { readPendingCheckout } from './readPendingCheckout.ts';
import { savePendingCheckout } from './savePendingCheckout.ts';

function memoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    removeItem: (key: string) => void values.delete(key),
  };
}

const throwingStorage = {
  getItem: () => {
    throw new Error('blocked');
  },
  setItem: () => {
    throw new Error('quota');
  },
  removeItem: () => {
    throw new Error('blocked');
  },
};

describe('pending checkout storage', () => {
  it('returns nothing when storage is missing, empty, or malformed', () => {
    expect(readPendingCheckout(undefined)).toBeNull();
    expect(readPendingCheckout(memoryStorage())).toBeNull();
    expect(
      readPendingCheckout(memoryStorage({ [PENDING_CHECKOUT_KEY]: 'nope' })),
    ).toBeNull();
    expect(
      readPendingCheckout(
        memoryStorage({ [PENDING_CHECKOUT_KEY]: JSON.stringify({ slot: -1 }) }),
      ),
    ).toBeNull();
  });

  it('keeps the account and session until cleared', () => {
    const storage = memoryStorage();

    expect(
      savePendingCheckout({ storage, pending: { slot: 2, sessionId: null } }),
    ).toBe(true);
    expect(readPendingCheckout(storage)).toEqual({ slot: 2, sessionId: null });

    savePendingCheckout({ storage, pending: { slot: 2, sessionId: 'cs_1' } });
    expect(readPendingCheckout(storage)).toEqual({
      slot: 2,
      sessionId: 'cs_1',
    });

    savePendingCheckout({ storage, pending: null });
    expect(readPendingCheckout(storage)).toBeNull();
  });

  it('reports a refused write and swallows a refused read', () => {
    expect(
      savePendingCheckout({
        storage: throwingStorage,
        pending: { slot: 0, sessionId: 'cs_1' },
      }),
    ).toBe(false);
    expect(savePendingCheckout({ storage: undefined, pending: null })).toBe(
      false,
    );
    expect(readPendingCheckout(throwingStorage)).toBeNull();
  });
});
