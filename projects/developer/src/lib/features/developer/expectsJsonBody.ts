import type { Endpoint } from '$lib/openapi/Endpoint.ts';

export function expectsJsonBody(endpoint: Endpoint): boolean {
  return endpoint.requestBody?.contentType.toLocaleLowerCase().includes(
    'json',
  ) === true;
}
