import { isSensitiveName } from '$lib/api/isSensitiveName.ts';
import { mentionsSensitiveName } from '$lib/api/mentionsSensitiveName.ts';

function sanitizeJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeJsonValue);
  if (typeof value !== 'object' || value === null) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      isSensitiveName(key) ? '' : sanitizeJsonValue(entry),
    ]),
  );
}

export function sanitizeBody(body: string): string {
  try {
    return JSON.stringify(sanitizeJsonValue(JSON.parse(body)), null, 2);
  } catch {
    return mentionsSensitiveName(body) ? '' : body;
  }
}
