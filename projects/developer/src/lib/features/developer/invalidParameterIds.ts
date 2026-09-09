import type { ApiHeader } from '$lib/api/ApiHeader.ts';
import { parameterHeaderId } from '$lib/api/headerIds.ts';
import type { Endpoint } from '$lib/openapi/Endpoint.ts';
import type { EndpointParameter } from '$lib/openapi/EndpointParameter.ts';

function currentParameterValue({
  parameter,
  values,
  headers,
}: {
  parameter: EndpointParameter;
  values: Readonly<Record<string, string>>;
  headers: ReadonlyArray<ApiHeader>;
}): string {
  if (parameter.location !== 'header') return values[parameter.id] ?? '';

  return headers.find(({ id }) => id === parameterHeaderId(parameter.id))
    ?.value ?? '';
}

export function invalidParameterIds({
  endpoint,
  values,
  headers,
}: {
  endpoint: Endpoint;
  values: Readonly<Record<string, string>>;
  headers: ReadonlyArray<ApiHeader>;
}): ReadonlyArray<string> {
  return endpoint.parameters.filter((parameter) => {
    const value = currentParameterValue({ parameter, values, headers }).trim();
    if (!value) return false;

    switch (parameter.type.toLocaleLowerCase()) {
      case 'boolean':
        return value !== 'true' && value !== 'false';
      case 'integer':
        return !/^[+-]?\d+$/.test(value);
      default:
        return false;
    }
  }).map(({ id }) => id);
}

export function hasInvalidParameterValues(
  options: Parameters<typeof invalidParameterIds>[0],
): boolean {
  return invalidParameterIds(options).length > 0;
}
