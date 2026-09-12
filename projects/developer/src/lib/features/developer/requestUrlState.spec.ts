import { describe, expect, it } from 'vitest';
import { seedCatalog } from '$lib/openapi/seedCatalog.ts';
import {
  decodeRequestUrlState,
  encodeRequestUrlState,
} from './requestUrlState.ts';

describe('requestUrlState', () => {
  it('should round-trip a shareable request configuration', () => {
    const endpoint = seedCatalog.endpoints.at(0);
    if (!endpoint) throw new Error('Missing seed endpoint.');

    const fragment = encodeRequestUrlState({
      endpoint,
      mainServerUrl: 'https://apiz.trakt.tv',
      serverUrl: 'https://api.trakt.tv',
      values: {
        'path:id': 'blade-runner-2049-2017',
        'query:extended': 'full',
      },
      headers: [{
        id: 'accept',
        name: 'Accept',
        value: 'application/json',
        enabled: true,
      }],
      body: '{"note":"Déjà vu"}',
      activeTab: 'headers',
    });

    expect(fragment).toContain('#v=1&endpoint=moviesSummary');
    expect(fragment).toContain('mainServer=https%3A%2F%2Fapiz.trakt.tv');
    expect(fragment).toContain('server=https%3A%2F%2Fapi.trakt.tv');
    expect(fragment).toContain('param.path%3Aid=blade-runner-2049-2017');
    expect(decodeRequestUrlState(fragment)).toEqual({
      endpointId: endpoint.id,
      mainServerUrl: 'https://apiz.trakt.tv',
      serverUrl: 'https://api.trakt.tv',
      values: {
        'path:id': 'blade-runner-2049-2017',
        'query:extended': 'full',
      },
      headers: [{
        id: 'accept',
        name: 'Accept',
        value: 'application/json',
        enabled: true,
      }],
      authorizationEnabled: true,
      body: '{\n  "note": "Déjà vu"\n}',
      activeTab: 'headers',
    });
  });

  it('should exclude credentials and tokens from shared state', () => {
    const endpoint = seedCatalog.endpoints.at(0);
    if (!endpoint) throw new Error('Missing seed endpoint.');

    const fragment = encodeRequestUrlState({
      endpoint,
      mainServerUrl: 'https://api.trakt.tv',
      serverUrl: 'https://api.trakt.tv',
      values: { 'path:id': 'tron-legacy-2010' },
      headers: [
        {
          id: 'managed-api-key',
          name: 'trakt-api-key',
          value: 'secret-key',
          enabled: true,
          managed: true,
        },
        {
          id: 'custom-auth',
          name: 'Authorization',
          value: 'Bearer secret-token',
          enabled: true,
        },
      ],
      body: '{"title":"Safe","clientSecret":"secret","access_token":"token"}',
      activeTab: 'body',
    });
    const decoded = decodeRequestUrlState(fragment);

    expect(fragment).not.toContain('secret-key');
    expect(fragment).not.toContain('secret-token');
    expect(decoded?.headers).toEqual([]);
    expect(decoded?.authorizationEnabled).toBe(true);
    expect(decoded?.body).toBe(
      '{\n  "title": "Safe",\n  "clientSecret": "",\n  "access_token": ""\n}',
    );
  });

  it('should preserve an anonymous request without exposing credentials', () => {
    const endpoint = seedCatalog.endpoints.at(0);
    if (!endpoint) throw new Error('Missing seed endpoint.');

    const fragment = encodeRequestUrlState({
      endpoint,
      mainServerUrl: 'https://api.trakt.tv',
      serverUrl: 'https://api.trakt.tv',
      values: {},
      headers: [{
        id: 'managed-authorization',
        name: 'Authorization',
        value: 'Bearer ••••••••',
        enabled: false,
        managed: true,
      }],
      body: '',
      activeTab: 'headers',
    });

    expect(fragment).toContain('authorization=0');
    expect(fragment).not.toContain('Bearer');
    expect(decodeRequestUrlState(fragment)?.authorizationEnabled).toBe(false);
  });

  it('should ignore malformed fragments', () => {
    expect(decodeRequestUrlState('#request=not-valid-base64')).toBeNull();
    expect(decodeRequestUrlState('#unrelated=value')).toBeNull();
  });
});
