import { describe, expect, it } from 'vitest';
import type { Endpoint } from '$lib/openapi/Endpoint.ts';
import { managedHeaders } from './managedHeaders.ts';

const baseEndpoint: Endpoint = {
  id: 'moviesSummary',
  method: 'GET',
  path: '/movies/{id}',
  summary: 'Get a movie',
  description: 'Returns a single movie.',
  operationId: 'moviesSummary',
  tags: ['Movies'],
  deprecated: false,
  auth: 'optional',
  parameters: [],
  requestBody: null,
  responses: [],
  serverUrls: ['https://api.trakt.tv'],
};

describe('managedHeaders', () => {
  it('should mark authorization as not attached when signed out', () => {
    const headers = managedHeaders({
      endpoint: baseEndpoint,
      selectedAccountSlot: null,
      authorizationEnabled: true,
    });

    expect(headers).toContainEqual({
      id: 'managed-authorization',
      name: 'Authorization',
      value: 'Not attached',
      enabled: false,
      managed: true,
    });
  });

  it('should mask the bearer token and enable it when signed in with authorization on', () => {
    const headers = managedHeaders({
      endpoint: baseEndpoint,
      selectedAccountSlot: 1,
      authorizationEnabled: true,
    });

    expect(headers).toContainEqual({
      id: 'managed-authorization',
      name: 'Authorization',
      value: 'Bearer ••••••••',
      enabled: true,
      managed: true,
    });
  });

  it('should disable the authorization header when signed in with authorization off', () => {
    const headers = managedHeaders({
      endpoint: baseEndpoint,
      selectedAccountSlot: 1,
      authorizationEnabled: false,
    });

    expect(headers).toContainEqual({
      id: 'managed-authorization',
      name: 'Authorization',
      value: 'Bearer ••••••••',
      enabled: false,
      managed: true,
    });
  });

  it('should omit the authorization header for endpoint-level auth', () => {
    const headers = managedHeaders({
      endpoint: { ...baseEndpoint, auth: 'endpoint' },
      selectedAccountSlot: 1,
      authorizationEnabled: true,
    });

    expect(
      headers.find((header) => header.id === 'managed-authorization'),
    ).toBeUndefined();
  });

  it('should always include the masked API key and version headers', () => {
    const headers = managedHeaders({
      endpoint: baseEndpoint,
      selectedAccountSlot: null,
      authorizationEnabled: true,
    });

    expect(headers).toContainEqual({
      id: 'managed-api-key',
      name: 'trakt-api-key',
      value: '••••••••',
      enabled: true,
      managed: true,
    });
    expect(headers).toContainEqual({
      id: 'managed-api-version',
      name: 'trakt-api-version',
      value: '2',
      enabled: true,
      managed: true,
    });
  });
});
