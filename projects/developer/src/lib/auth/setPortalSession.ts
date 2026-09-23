import { setContext } from 'svelte';
import { PORTAL_SESSION_KEY } from './PORTAL_SESSION_KEY.ts';
import type { PortalSession } from './portalSession.ts';

export function setPortalSession(session: PortalSession): void {
  setContext(PORTAL_SESSION_KEY, session);
}
