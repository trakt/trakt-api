import type { DeveloperTier } from './DeveloperTier.ts';

export function developerApiHost(tier: DeveloperTier): string {
  return tier === 'premium' ? 'apiz.trakt.tv' : 'api.trakt.tv';
}
