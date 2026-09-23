import { RETURN_SECTION } from './RETURN_SECTION.ts';
import { safeReturnPath } from './safeReturnPath.ts';
import { takeSessionValue } from './takeSessionValue.ts';

export function takeReturnPath(): string {
  return safeReturnPath(takeSessionValue(RETURN_SECTION));
}
