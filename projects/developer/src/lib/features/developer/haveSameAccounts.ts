import type { DeveloperAccount } from '$lib/api/DeveloperAccount.ts';

export function haveSameAccounts(
  previous: ReadonlyArray<DeveloperAccount>,
  next: ReadonlyArray<DeveloperAccount>,
): boolean {
  return (
    previous.length === next.length &&
    previous.every((account, index) => {
      const other = next.at(index);

      return (
        other !== undefined &&
        account.slot === other.slot &&
        account.username === other.username &&
        account.expiresAt === other.expiresAt &&
        account.hasSessionError === other.hasSessionError
      );
    })
  );
}
