import type { DeveloperAccountState } from './DeveloperAccountState.ts';

export async function fetchAccounts(): Promise<DeveloperAccountState> {
  const response = await fetch('/api/accounts');
  if (!response.ok) return { accounts: [] };

  const body = await response.json().catch(() => ({
    accounts: [],
  }));
  return {
    accounts: Array.isArray(body.accounts) ? body.accounts : [],
  };
}
