import { initContract } from '@ts-rest/core';

export const builder = initContract();

export type AuthRequirement = 'none' | 'optional' | 'required';

export type TraktRouteMetadata = {
  auth?: AuthRequirement;
};

export function authMetadata(auth: AuthRequirement): TraktRouteMetadata {
  return { auth };
}
