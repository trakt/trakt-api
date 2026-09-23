import { writeUsername } from './writeUsername.ts';
import { resolveUsername } from './resolveUsername.ts';

export async function storeUsername(
  slot: number,
  accessToken: string,
): Promise<void> {
  writeUsername(slot, await resolveUsername({ accessToken, slot }));
}
