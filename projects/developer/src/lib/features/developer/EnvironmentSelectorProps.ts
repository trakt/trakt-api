import type { DeveloperAccount } from '$lib/api/DeveloperAccount.ts';

export type EnvironmentSelectorProps = {
  accounts: ReadonlyArray<DeveloperAccount>;
  selectedSlot: number | null;
  serverUrl: string;
  servers: ReadonlyArray<{
    label: string;
    host: string;
    url: string;
  }>;
  onAccount: (slot: number) => void;
  onServer: (url: string) => void;
  onLogout: (slot: number) => void;
  onAccountsChanged: () => Promise<void>;
};
