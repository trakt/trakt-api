import { describe, expect, it } from 'vitest';
import type { ResponseHistoryEntry } from './ResponseHistoryEntry.ts';
import {
  loadResponseHistory,
  saveResponseHistory,
} from './responseHistoryStorage.ts';

function memoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()].at(index) ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
}

describe('responseHistoryStorage', () => {
  it('should restore session responses without persisting credentials', () => {
    const storage = memoryStorage();
    const entry: ResponseHistoryEntry = {
      id: 'response-1',
      endpointId: 'oauthToken',
      sequence: 1,
      receivedAt: '2026-09-01T08:00:00.000Z',
      request: {
        method: 'POST',
        url:
          'https://auth.trakt.tv/oauth/token?code=temporary-code&clientId=query-id',
      },
      response: {
        status: 200,
        statusText: 'OK',
        durationMs: 42,
        size: 128,
        headers: [],
        body: JSON.stringify({
          access_token: 'secret-token',
          client_id: 'underscore-id',
          'client-id': 'hyphen-id',
          clientId: 'camel-id',
          scope: 'public',
        }),
        isJson: true,
      },
    };

    saveResponseHistory({ storage, entries: [entry] });
    const restored = loadResponseHistory(storage).at(0);

    expect(restored?.request.url).not.toContain('temporary-code');
    expect(restored?.response.body).not.toContain('secret-token');
    expect(restored?.response.body).toContain('[redacted]');
    expect(JSON.stringify(restored)).not.toMatch(
      /query-id|underscore-id|hyphen-id|camel-id/,
    );
  });
});
