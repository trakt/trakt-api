import type { Endpoint } from '$lib/openapi/Endpoint.ts';
import { expectsJsonBody } from './expectsJsonBody.ts';

export function hasInvalidJsonBody({
  endpoint,
  body,
}: {
  endpoint: Endpoint;
  body: string;
}): boolean {
  if (!expectsJsonBody(endpoint) || !body.trim()) return false;

  try {
    JSON.parse(body);
    return false;
  } catch {
    return true;
  }
}
