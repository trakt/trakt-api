import { describe, expect, it } from 'vitest';
import type { DeveloperAccount } from '$lib/api/DeveloperAccount.ts';
import { haveSameAccounts } from './haveSameAccounts.ts';

function account(overrides: Partial<DeveloperAccount> = {}): DeveloperAccount {
  return {
    slot: 0,
    username: 'vlad',
    expiresAt: 1_000,
    isExpired: false,
    hasSessionError: false,
    source: 'developer-oauth',
    ...overrides,
  };
}

describe('haveSameAccounts', () => {
  it('treats two empty lists as the same', () => {
    expect(haveSameAccounts([], [])).toBe(true);
  });

  it('treats equal accounts as the same', () => {
    expect(haveSameAccounts([account()], [account()])).toBe(true);
  });

  it('ignores the derived expired flag', () => {
    expect(haveSameAccounts([account()], [account({ isExpired: true })])).toBe(
      true,
    );
  });

  it('detects a signed-in account', () => {
    expect(haveSameAccounts([], [account()])).toBe(false);
  });

  it('detects a signed-out account', () => {
    expect(
      haveSameAccounts([account(), account({ slot: 1 })], [account()]),
    ).toBe(false);
  });

  it('detects a different slot', () => {
    expect(haveSameAccounts([account()], [account({ slot: 1 })])).toBe(false);
  });

  it('detects a different username', () => {
    expect(haveSameAccounts([account()], [account({ username: 'sean' })])).toBe(
      false,
    );
  });

  it('detects a refreshed token', () => {
    expect(haveSameAccounts([account()], [account({ expiresAt: 2_000 })])).toBe(
      false,
    );
  });

  it('detects a session error', () => {
    expect(
      haveSameAccounts([account()], [account({ hasSessionError: true })]),
    ).toBe(false);
  });
});
