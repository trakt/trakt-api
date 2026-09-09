import type { Endpoint } from '$lib/openapi/Endpoint.ts';

export function resolveEndpointServer({
  endpoint,
  mainServerUrl,
  requestServerUrl,
}: {
  endpoint: Endpoint;
  mainServerUrl: string;
  requestServerUrl?: string;
}): string {
  if (endpoint.serverUrls.includes(mainServerUrl)) return mainServerUrl;
  if (requestServerUrl && endpoint.serverUrls.includes(requestServerUrl)) {
    return requestServerUrl;
  }

  return endpoint.serverUrls.at(0) ?? mainServerUrl;
}
