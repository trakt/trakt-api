import { describe, expect, it } from 'vitest';
import type { Endpoint } from '$lib/openapi/Endpoint.ts';
import { seedCatalog } from '$lib/openapi/seedCatalog.ts';
import { resolveEndpointServer } from './resolveEndpointServer.ts';

const PUBLIC_SERVER = 'https://api.trakt.tv';
const PREMIUM_SERVER = 'https://apiz.trakt.tv';
const AUTH_SERVER = 'https://auth.trakt.tv';

function endpointWithServers(serverUrls: ReadonlyArray<string>): Endpoint {
  const endpoint = seedCatalog.endpoints.at(0);
  if (!endpoint) throw new Error('Missing seed endpoint.');
  return { ...endpoint, serverUrls };
}

describe('resolveEndpointServer', () => {
  it('should apply the main server when the endpoint supports it', () => {
    const endpoint = endpointWithServers([PUBLIC_SERVER, PREMIUM_SERVER]);

    expect(resolveEndpointServer({ endpoint, mainServerUrl: PREMIUM_SERVER }))
      .toBe(PREMIUM_SERVER);
  });

  it('should preserve an endpoint-specific auth server', () => {
    const endpoint = endpointWithServers([AUTH_SERVER]);

    expect(resolveEndpointServer({ endpoint, mainServerUrl: PREMIUM_SERVER }))
      .toBe(AUTH_SERVER);
  });

  it('should restore a valid request-level override when the main server is unavailable', () => {
    const endpoint = endpointWithServers([
      AUTH_SERVER,
      'https://auth-alt.trakt.tv',
    ]);

    expect(resolveEndpointServer({
      endpoint,
      mainServerUrl: PUBLIC_SERVER,
      requestServerUrl: 'https://auth-alt.trakt.tv',
    })).toBe('https://auth-alt.trakt.tv');
  });
});
