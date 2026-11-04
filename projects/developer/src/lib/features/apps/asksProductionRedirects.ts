import type { ProductionSignIn } from './ProductionSignIn.ts';

export function asksProductionRedirects({
  redirectsNeeded,
  signIn,
}: {
  redirectsNeeded: boolean;
  signIn: ProductionSignIn;
}): boolean {
  return redirectsNeeded && signIn === 'pkce';
}
