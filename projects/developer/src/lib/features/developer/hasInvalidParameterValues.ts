import { invalidParameterIds } from './invalidParameterIds.ts';

export function hasInvalidParameterValues(
  options: Parameters<typeof invalidParameterIds>[0],
): boolean {
  return invalidParameterIds(options).length > 0;
}
