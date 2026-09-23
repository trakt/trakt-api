import { normalizedFieldName } from './normalizedFieldName.ts';
import { SENSITIVE_FIELD_NAMES } from './SENSITIVE_FIELD_NAMES.ts';

const SENSITIVE_COMPACT_NAMES = new Set(
  [...SENSITIVE_FIELD_NAMES].map((name) => name.replaceAll('_', '')),
);

const SENSITIVE_SUFFIX = /(?:token|secret|apikey|password)$/;

const SENSITIVE_SEGMENT =
  /(?:^|[-_])(?:api[-_]?key|access[-_]?token|refresh[-_]?token|auth(?:orization)?|client[-_]?(?:id|secret)|cookie|password|secret|token)(?:$|[-_])/i;

export function isSensitiveName(value: string): boolean {
  const compactName = normalizedFieldName(value).replaceAll('_', '');

  return SENSITIVE_COMPACT_NAMES.has(compactName) ||
    SENSITIVE_SUFFIX.test(compactName) ||
    SENSITIVE_SEGMENT.test(value.trim());
}
