import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ResponseHistoryEntry } from './ResponseHistoryEntry.ts';
import { saveResponseHistory } from './saveResponseHistory.ts';

function recordingStorage() {
  const writes: Array<string> = [];
  const storage = {
    getItem: () => null,
    setItem: (_key: string, value: string) => {
      writes.push(value);
    },
  } as unknown as Storage;

  return { storage, writes };
}

function jsonEntry(id: string): ResponseHistoryEntry {
  return {
    id,
    endpointId: 'usersSettings',
    sequence: 1,
    receivedAt: '2026-09-01T08:00:00.000Z',
    request: {
      method: 'GET',
      url: 'https://api.trakt.tv/users/settings?api_key=query-key',
    },
    response: {
      status: 200,
      statusText: 'OK',
      durationMs: 12,
      size: 64,
      headers: [],
      body: JSON.stringify({
        access_token: 'secret-token',
        nested: { client_secret: 'secret-value', name: 'visible' },
        scope: 'public',
      }),
      isJson: true,
    },
  };
}

describe('saveResponseHistory', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes identical redacted bytes when the same entries are saved twice', () => {
    const { storage, writes } = recordingStorage();
    const entries = [jsonEntry('response-1')];

    saveResponseHistory({ storage, entries });
    saveResponseHistory({ storage, entries });

    const [first, second] = writes;
    expect(first).toBe(second);
    expect(first).not.toMatch(/secret-token|secret-value|query-key/);
    expect(first).toContain('[REDACTED]');
    expect(first).toContain('visible');
  });

  it('does not parse an entry body again when the same entry is saved again', () => {
    const { storage } = recordingStorage();
    const entries = [jsonEntry('response-2'), jsonEntry('response-3')];
    const parse = vi.spyOn(JSON, 'parse');

    saveResponseHistory({ storage, entries });
    expect(parse).toHaveBeenCalledTimes(entries.length);

    parse.mockClear();
    saveResponseHistory({ storage, entries: [...entries] });

    expect(parse).not.toHaveBeenCalled();
  });
});
