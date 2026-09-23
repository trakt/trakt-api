import type { HttpMethod } from '$lib/openapi/HttpMethod.ts';
import { redactUrl } from './redactUrl.ts';

export function formatRequestLine({
  method,
  url,
}: {
  method: HttpMethod;
  url: string;
}): string {
  return `${method} ${redactUrl(url)}`;
}
