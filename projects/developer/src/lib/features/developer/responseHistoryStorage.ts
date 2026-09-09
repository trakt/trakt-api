import type { ApiExecutionResponse } from '$lib/api/ApiExecution.ts';
import type { ResponseHistoryEntry } from './ResponseHistoryEntry.ts';

const MAX_STORED_RESPONSES = 20;
const MAX_STORED_BODY_CHARACTERS = 250_000;
const REDACTED_VALUE = '[redacted]';
const SENSITIVE_NAMES = new Set([
  'access_token',
  'authorization',
  'client_id',
  'client_secret',
  'code',
  'device_code',
  'password',
  'refresh_token',
  'secret',
  'token',
]);

function normalizedName(value: string): string {
  return value.trim().toLocaleLowerCase().replaceAll(/[^a-z0-9]+/g, '_')
    .replaceAll(/^_+|_+$/g, '');
}

function isSensitiveName(value: string): boolean {
  const name = normalizedName(value);
  return name.replaceAll('_', '') === 'clientid' ||
    SENSITIVE_NAMES.has(name) || name.endsWith('_secret') ||
    name.endsWith('_token');
}

function sanitizeJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeJson);
  if (typeof value !== 'object' || value === null) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      isSensitiveName(key) ? REDACTED_VALUE : sanitizeJson(entry),
    ]),
  );
}

function sanitizeBody(response: ApiExecutionResponse): string {
  let body = response.body;

  if (response.isJson) {
    try {
      body = JSON.stringify(sanitizeJson(JSON.parse(body)), null, 2);
    } catch {
      body = response.body;
    }
  } else if (
    [...SENSITIVE_NAMES].some((name) => normalizedName(body).includes(name))
  ) {
    body = '[Sensitive response body omitted from session history]';
  }

  if (body.length <= MAX_STORED_BODY_CHARACTERS) return body;
  return `${
    body.slice(0, MAX_STORED_BODY_CHARACTERS)
  }\n… Session history truncated`;
}

function sanitizeUrl(value: string): string {
  try {
    const url = new URL(value);
    for (const name of [...url.searchParams.keys()]) {
      if (isSensitiveName(name)) url.searchParams.set(name, REDACTED_VALUE);
    }

    return url.toString();
  } catch {
    return value;
  }
}

function storedEntry(entry: ResponseHistoryEntry): ResponseHistoryEntry {
  return {
    ...entry,
    request: { ...entry.request, url: sanitizeUrl(entry.request.url) },
    response: { ...entry.response, body: sanitizeBody(entry.response) },
  };
}

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

export function saveResponseHistory({
  storage,
  entries,
}: {
  storage: Storage;
  entries: ReadonlyArray<ResponseHistoryEntry>;
}) {
  try {
    storage.setItem(
      'trakt-developer-response-history',
      JSON.stringify(entries.slice(-MAX_STORED_RESPONSES).map(storedEntry)),
    );
  } catch {
    // Response history remains available in memory when session storage is full.
  }
}
