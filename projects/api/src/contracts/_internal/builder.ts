import { initContract } from '@ts-rest/core';

// Explicit type keeps JSR/tsc from inlining ts-rest's internal (unnameable)
// contract type into the emitted declarations.
/** Builder. */
export const builder: ReturnType<typeof initContract> = initContract();

/** The auth requirement type. */
export type AuthRequirement = 'none' | 'optional' | 'required';

/** The trakt route metadata type. */
export type TraktRouteMetadata = {
  auth?: AuthRequirement;
};

/** Auth metadata. */
export function authMetadata(auth: AuthRequirement): TraktRouteMetadata {
  return { auth };
}
