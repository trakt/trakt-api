import type { ApiHeader } from '$lib/api/ApiHeader.ts';
import { parameterHeaderId } from '$lib/api/headerIds.ts';
import type { Endpoint } from '$lib/openapi/Endpoint.ts';

export function missingRequiredParameterIds({
  endpoint,
  values,
  headers,
}: {
  endpoint: Endpoint;
  values: Readonly<Record<string, string>>;
  headers: ReadonlyArray<ApiHeader>;
}): ReadonlyArray<string> {
  return endpoint.parameters.filter((parameter) => {
    if (!parameter.required) return false;

    if (parameter.location !== 'header') {
      return !values[parameter.id]?.trim();
    }

    const header = headers.find(
      (candidate) => candidate.id === parameterHeaderId(parameter.id),
    );

    return !header?.enabled ||
      header.name.trim().toLocaleLowerCase() !==
        parameter.name.toLocaleLowerCase() ||
      !header.value.trim();
  }).map(({ id }) => id);
}

export function hasMissingRequiredParameters(
  options: Parameters<typeof missingRequiredParameterIds>[0],
): boolean {
  return missingRequiredParameterIds(options).length > 0;
}
