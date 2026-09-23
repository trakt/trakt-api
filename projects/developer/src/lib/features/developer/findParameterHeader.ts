import type { ApiHeader } from '$lib/api/ApiHeader.ts';
import { parameterHeaderId } from '$lib/api/parameterHeaderId.ts';
import type { EndpointParameter } from '$lib/openapi/EndpointParameter.ts';

export function findParameterHeader({
  parameter,
  headers,
}: {
  parameter: EndpointParameter;
  headers: ReadonlyArray<ApiHeader>;
}): ApiHeader | undefined {
  return headers.find(
    (candidate) => candidate.id === parameterHeaderId(parameter.id),
  );
}
