import type { ProductionSignIn } from './ProductionSignIn.ts';

export function requestsClientSecret({
  needsSecret,
  hasClientSecret,
  signIn,
}: {
  needsSecret: boolean;
  hasClientSecret: boolean;
  signIn: ProductionSignIn;
}): boolean {
  return needsSecret && !hasClientSecret && signIn !== 'none';
}
