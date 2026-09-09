import type { Endpoint } from '$lib/openapi/Endpoint.ts';
import { expectsJsonBody } from './expectsJsonBody.ts';

export function hasMissingExpectedJsonBody({
  endpoint,
  body,
}: {
  endpoint: Endpoint;
  body: string;
}): boolean {
  return expectsJsonBody(endpoint) && !body.trim();
}
