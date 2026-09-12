import { describe, expect, it } from 'vitest';
import { buildEndpointUrl } from './buildEndpointUrl.ts';
import { seedCatalog } from './seedCatalog.ts';

describe('buildEndpointUrl', () => {
  it('should encode path values and append non-empty query values', () => {
    const endpoint = seedCatalog.endpoints.at(0);
    if (!endpoint) throw new Error('Missing seed endpoint.');

    expect(buildEndpointUrl({
      endpoint,
      serverUrl: 'https://api.trakt.tv',
      values: {
        'path:id': 'blade runner/1982',
        'query:extended': 'full',
      },
    })).toBe(
      'https://api.trakt.tv/movies/blade%20runner%2F1982?extended=full',
    );
  });

  it('should show placeholders for missing required path values', () => {
    const seedEndpoint = seedCatalog.endpoints.at(0);
    if (!seedEndpoint) throw new Error('Missing seed endpoint.');

    const endpoint = {
      ...seedEndpoint,
      path: '/calendars/{start_date}/{days}',
      parameters: [
        {
          id: 'path:start_date',
          name: 'start_date',
          location: 'path' as const,
          required: true,
          description: 'Calendar start date.',
          type: 'string',
          enumValues: [],
          defaultValue: '',
        },
        {
          id: 'path:days',
          name: 'days',
          location: 'path' as const,
          required: true,
          description: 'Number of days.',
          type: 'integer',
          enumValues: [],
          defaultValue: '',
        },
      ],
    };

    expect(buildEndpointUrl({
      endpoint,
      serverUrl: 'https://api.trakt.tv',
      values: { 'path:days': '   ' },
    })).toBe(
      'https://api.trakt.tv/calendars/{start_date}/{days}',
    );
  });
});
