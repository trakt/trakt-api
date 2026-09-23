import type { ApiExecutionResponse } from '$lib/api/ApiExecutionResponse.ts';
import { isSensitiveName } from '$lib/api/isSensitiveName.ts';
import { mentionsSensitiveName } from '$lib/api/mentionsSensitiveName.ts';
import { REDACTED } from '$lib/api/REDACTED.ts';
import type { ResponseHistoryEntry } from './ResponseHistoryEntry.ts';

const MAX_STORED_RESPONSES = 20;
const MAX_STORED_BODY_CHARACTERS = 250_000;

function sanitizeJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeJson);
  if (typeof value !== 'object' || value === null) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      isSensitiveName(key) ? REDACTED : sanitizeJson(entry),
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
  } else if (mentionsSensitiveName(body)) {
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
      if (isSensitiveName(name)) url.searchParams.set(name, REDACTED);
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
