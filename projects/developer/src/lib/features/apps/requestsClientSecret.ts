import type { ProductionSignIn } from './ProductionSignIn.ts';

/** Only PKCE apps can ask: device code sign-in works with the Client ID alone. */
export function requestsClientSecret({
  needsSecret,
  hasClientSecret,
  signIn,
}: {
  needsSecret: boolean;
  hasClientSecret: boolean;
  signIn: ProductionSignIn;
}): boolean {
  return needsSecret && !hasClientSecret && signIn === 'pkce';
}
