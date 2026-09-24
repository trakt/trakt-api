import type { DeveloperAccount } from '$lib/api/DeveloperAccount.ts';

export type AccountMenuProps = {
  avatar?: string | null;
  accounts: ReadonlyArray<DeveloperAccount>;
  selectedSlot: number | null;
  onAccount: (slot: number) => void;
  onLogout: (slot: number) => void;
};
