import type { ApiHeader } from '$lib/api/ApiHeader.ts';
import type { HttpMethod } from '$lib/openapi/HttpMethod.ts';

const REDACTED = '[REDACTED]';
const SENSITIVE_NAME_PATTERN =
  /(?:^|[-_])(api[-_]?key|access[-_]?token|refresh[-_]?token|auth(?:orization)?|client[-_]?(?:id|secret)|cookie|password|secret|token)(?:$|[-_])/i;

function isSensitiveName(name: string): boolean {
  return SENSITIVE_NAME_PATTERN.test(name.trim());
}

function redactUrl(value: string): string {
  try {
    const url = new URL(value);
    const sensitiveNames = [...url.searchParams.keys()].filter(isSensitiveName);
    if (sensitiveNames.length === 0) return value;
    for (const name of sensitiveNames) url.searchParams.set(name, REDACTED);
    return url.toString();
  } catch {
    return value;
  }
}

function redactHeaderValue(name: string, value: string): string {
  if (!isSensitiveName(name)) return value;
  if (name.trim().toLocaleLowerCase() !== 'authorization') return REDACTED;

  const scheme = value.trim().split(/\s+/, 1).at(0);
  return scheme && scheme.toLocaleLowerCase() !== 'not'
    ? `${scheme} ${REDACTED}`
    : REDACTED;
}

function shellQuote(value: string): string {
  return `'${value.replaceAll("'", `'"'"'`)}'`;
}

function redactBody(body: string): string {
  try {
    let redacted = false;
    const value = JSON.stringify(JSON.parse(body), (name, value) => {
      if (!isSensitiveName(name)) return value;
      redacted = true;
      return REDACTED;
    });
    return redacted ? value : body;
  } catch {
    return REDACTED;
  }
}

export function formatRequestLine({
  method,
  url,
}: {
  method: HttpMethod;
  url: string;
}): string {
  return `${method} ${redactUrl(url)}`;
}

export function formatCurlRequest({
  method,
  url,
  headers,
  body,
}: {
  method: HttpMethod;
  url: string;
  headers: ReadonlyArray<ApiHeader>;
  body: string;
}): string {
  const enabledHeaders = headers.filter(({ enabled, name }) =>
    enabled && Boolean(name.trim())
  );
  const hasContentType = enabledHeaders.some(({ name }) =>
    name.trim().toLocaleLowerCase() === 'content-type'
  );
  const parts = [
    `curl --request ${method}`,
    `  --url ${shellQuote(redactUrl(url))}`,
    ...enabledHeaders.map(({ name, value }) =>
      `  --header ${
        shellQuote(`${name.trim()}: ${redactHeaderValue(name, value)}`)
      }`
    ),
  ];

  if (body && !hasContentType) {
    parts.push(`  --header ${shellQuote('content-type: application/json')}`);
  }

  if (body) parts.push(`  --data ${shellQuote(redactBody(body))}`);

  return parts.join(' \\\n');
}
