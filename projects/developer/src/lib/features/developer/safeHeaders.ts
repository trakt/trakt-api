import type { ApiHeader } from '$lib/api/ApiHeader.ts';
import { isSensitiveName } from '$lib/api/isSensitiveName.ts';

export function safeHeaders(
  headers: ReadonlyArray<ApiHeader>,
): ReadonlyArray<ApiHeader> {
  return headers
    .filter((header) =>
      header.managed !== true && !header.id.startsWith('managed-') &&
      !isSensitiveName(header.name) &&
      !/^(?:basic|bearer)\s+/i.test(header.value.trim())
    )
    .map(({ id, name, value, enabled }) => ({ id, name, value, enabled }));
}
