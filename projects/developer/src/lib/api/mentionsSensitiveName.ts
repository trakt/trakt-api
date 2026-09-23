import { normalizedFieldName } from './normalizedFieldName.ts';
import { SENSITIVE_FIELD_NAMES } from './SENSITIVE_FIELD_NAMES.ts';

export function mentionsSensitiveName(text: string): boolean {
  const normalized = normalizedFieldName(text);

  return [...SENSITIVE_FIELD_NAMES].some((name) => normalized.includes(name));
}
