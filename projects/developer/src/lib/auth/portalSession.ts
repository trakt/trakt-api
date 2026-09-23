import { getContext } from 'svelte';
import type { DeveloperAccount } from '$lib/api/DeveloperAccount.ts';
import { PORTAL_SESSION_KEY } from './PORTAL_SESSION_KEY.ts';

export type PortalSession = {
  readonly account: DeveloperAccount | undefined;
  readonly loading: boolean;
  readonly vip: boolean | null;
};

export function portalSession(): PortalSession {
  return getContext<PortalSession>(PORTAL_SESSION_KEY);
}
