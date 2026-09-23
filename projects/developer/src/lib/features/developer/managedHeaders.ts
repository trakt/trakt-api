import type { ApiHeader } from '$lib/api/ApiHeader.ts';
import {
  MANAGED_AUTHORIZATION_HEADER_ID,
  parameterHeaderId,
} from '$lib/api/headerIds.ts';
import type { Endpoint } from '$lib/openapi/Endpoint.ts';

export function managedHeaders({
  endpoint,
  selectedAccountSlot,
  authorizationEnabled,
}: {
  endpoint: Endpoint;
  selectedAccountSlot: number | null;
  authorizationEnabled: boolean;
}): Array<ApiHeader> {
  const documented = endpoint.parameters
    .filter(
      (parameter) =>
        parameter.location === 'header' &&
        (endpoint.auth !== 'endpoint' ||
          parameter.name.toLocaleLowerCase() !== 'authorization'),
    )
    .map((parameter) => ({
      id: parameterHeaderId(parameter.id),
      name: parameter.name,
      value: parameter.defaultValue,
      enabled: Boolean(parameter.defaultValue),
    }));

  const authorizationHeader: Array<ApiHeader> = endpoint.auth === 'endpoint'
    ? []
    : [
      {
        id: MANAGED_AUTHORIZATION_HEADER_ID,
        name: 'Authorization',
        value: selectedAccountSlot === null
          ? 'Not attached'
          : 'Bearer ••••••••',
        enabled: selectedAccountSlot !== null && authorizationEnabled,
        managed: true,
      },
    ];

  return [
    {
      id: 'managed-api-key',
      name: 'trakt-api-key',
      value: '••••••••',
      enabled: true,
      managed: true,
    },
    {
      id: 'managed-api-version',
      name: 'trakt-api-version',
      value: '2',
      enabled: true,
      managed: true,
    },
    ...authorizationHeader,
    {
      id: 'accept',
      name: 'Accept',
      value: 'application/json',
      enabled: true,
    },
    ...documented,
  ];
}
