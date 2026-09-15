import { listAccounts } from '$lib/auth/listAccounts.ts';
import type { DeveloperAccountState } from './DeveloperAccountState.ts';

export async function fetchAccounts(): Promise<DeveloperAccountState> {
  return { accounts: await listAccounts().catch(() => []) };
}
