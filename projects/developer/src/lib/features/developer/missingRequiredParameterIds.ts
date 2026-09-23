import type { ApiHeader } from '$lib/api/ApiHeader.ts';
import type { Endpoint } from '$lib/openapi/Endpoint.ts';
import { findParameterHeader } from './findParameterHeader.ts';

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

    const header = findParameterHeader({ parameter, headers });

    return !header?.enabled ||
      header.name.trim().toLocaleLowerCase() !==
        parameter.name.toLocaleLowerCase() ||
      !header.value.trim();
  }).map(({ id }) => id);
}
