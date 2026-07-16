import { initContract } from '@ts-rest/core';

// Explicit type keeps JSR/tsc from inlining ts-rest's internal (unnameable)
// contract type into the emitted declarations.
export const builder: ReturnType<typeof initContract> = initContract();

export type AuthRequirement = 'none' | 'optional' | 'required';

export type TraktRouteMetadata = {
  auth?: AuthRequirement;
};

export function authMetadata(auth: AuthRequirement): TraktRouteMetadata {
  return { auth };
}
