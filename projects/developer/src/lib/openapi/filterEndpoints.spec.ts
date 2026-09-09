import { describe, expect, it } from 'vitest';
import { filterEndpoints } from './filterEndpoints.ts';
import { seedCatalog } from './seedCatalog.ts';

describe('filterEndpoints', () => {
  it('should match paths, operation identifiers, and titles', () => {
    const pathResult = filterEndpoints({
      endpoints: seedCatalog.endpoints,
      query: '/sync/history',
    });
    const operationResult = filterEndpoints({
      endpoints: seedCatalog.endpoints,
      query: 'syncHistoryAdd',
    });
    const titleResult = filterEndpoints({
      endpoints: seedCatalog.endpoints,
      query: 'watched history',
    });

    expect(pathResult.map((endpoint) => endpoint.id)).toEqual([
      'syncHistoryAdd',
    ]);
    expect(operationResult.map((endpoint) => endpoint.id)).toEqual([
      'syncHistoryAdd',
    ]);
    expect(titleResult.map((endpoint) => endpoint.id)).toEqual([
      'syncHistoryAdd',
    ]);
  });

  it('should not match methods, tags, or descriptions', () => {
    const endpoint = {
      ...seedCatalog.endpoints[0],
      method: 'DELETE' as const,
      tags: ['Hidden tag'],
      description: 'Hidden description',
    };

    for (
      const query of [
        'DELETE',
        'Hidden tag',
        'Hidden description',
      ]
    ) {
      expect(
        filterEndpoints({ endpoints: [endpoint], query }),
      ).toEqual([]);
    }
  });

  it('should return the full catalog for an empty query', () => {
    expect(
      filterEndpoints({ endpoints: seedCatalog.endpoints, query: '  ' }),
    ).toEqual(seedCatalog.endpoints);
  });
});
