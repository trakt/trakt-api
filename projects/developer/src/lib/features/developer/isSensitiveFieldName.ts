import { normalizedFieldName } from './normalizedFieldName.ts';
import { SENSITIVE_FIELD_NAMES } from './SENSITIVE_FIELD_NAMES.ts';

const SENSITIVE_COMPACT_FIELD_NAMES = new Set(
  [...SENSITIVE_FIELD_NAMES].map((name) => name.replaceAll('_', '')),
);

export function isSensitiveFieldName(value: string): boolean {
  const name = normalizedFieldName(value);
  const compactName = name.replaceAll('_', '');
  return SENSITIVE_FIELD_NAMES.has(name) ||
    SENSITIVE_COMPACT_FIELD_NAMES.has(compactName) ||
    name.endsWith('_secret') ||
    name.endsWith('_token') || name.endsWith('_api_key');
}
