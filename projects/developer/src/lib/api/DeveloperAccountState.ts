import type { DeveloperAccount } from './DeveloperAccount.ts';

export type DeveloperAccountState = {
  accounts: ReadonlyArray<DeveloperAccount>;
};
