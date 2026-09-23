import { missingRequiredParameterIds } from './missingRequiredParameterIds.ts';

export function hasMissingRequiredParameters(
  options: Parameters<typeof missingRequiredParameterIds>[0],
): boolean {
  return missingRequiredParameterIds(options).length > 0;
}
