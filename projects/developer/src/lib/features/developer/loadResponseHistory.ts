import type { ResponseHistoryEntry } from './ResponseHistoryEntry.ts';

function isResponseHistoryEntry(value: unknown): value is ResponseHistoryEntry {
  if (typeof value !== 'object' || value === null) return false;

  const entry = value as Partial<ResponseHistoryEntry>;
  return typeof entry.id === 'string' && typeof entry.endpointId === 'string' &&
    typeof entry.sequence === 'number' &&
    typeof entry.receivedAt === 'string' &&
    typeof entry.request?.method === 'string' &&
    typeof entry.request.url === 'string' &&
    typeof entry.response?.status === 'number' &&
    typeof entry.response.body === 'string' &&
    Array.isArray(entry.response.headers);
}

export function loadResponseHistory(
  storage: Storage,
): Array<ResponseHistoryEntry> {
  try {
    const value = JSON.parse(
      storage.getItem('trakt-developer-response-history') ?? '[]',
    );
    return Array.isArray(value) ? value.filter(isResponseHistoryEntry) : [];
  } catch {
    return [];
  }
}
