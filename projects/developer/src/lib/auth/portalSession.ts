import { getContext, setContext } from 'svelte';
import type { DeveloperAccount } from '$lib/api/DeveloperAccount.ts';
export type PortalSession = {
  readonly account: DeveloperAccount | undefined;
  readonly loading: boolean;
  readonly vip: boolean | null;
};
const SESSION = Symbol('portal-session');
export function setPortalSession(session: PortalSession): void {
  setContext(SESSION, session);
}
export function portalSession(): PortalSession {
  return getContext<PortalSession>(SESSION);
}
