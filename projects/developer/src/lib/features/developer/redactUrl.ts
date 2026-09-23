import { isSensitiveName } from '$lib/api/isSensitiveName.ts';
import { REDACTED } from '$lib/api/REDACTED.ts';

export function redactUrl(value: string): string {
  try {
    const url = new URL(value);
    const sensitiveNames = [...url.searchParams.keys()].filter(isSensitiveName);
    if (sensitiveNames.length === 0) return value;
    for (const name of sensitiveNames) url.searchParams.set(name, REDACTED);
    return url.toString();
  } catch {
    return value;
  }
}
