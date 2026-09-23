import { isSensitiveFieldName } from './isSensitiveFieldName.ts';
import { normalizedFieldName } from './normalizedFieldName.ts';
import { SENSITIVE_FIELD_NAMES } from './SENSITIVE_FIELD_NAMES.ts';

function sanitizeJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeJsonValue);
  if (typeof value !== 'object' || value === null) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      isSensitiveFieldName(key) ? '' : sanitizeJsonValue(entry),
    ]),
  );
}

export function sanitizeBody(body: string): string {
  try {
    return JSON.stringify(sanitizeJsonValue(JSON.parse(body)), null, 2);
  } catch {
    return [...SENSITIVE_FIELD_NAMES].some((name) =>
        normalizedFieldName(body).includes(name)
      )
      ? ''
      : body;
  }
}
