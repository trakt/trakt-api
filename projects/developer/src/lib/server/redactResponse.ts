const REDACTED = '[REDACTED]';
const SENSITIVE_NAME =
  /^(?:authorization|proxyauthorization|cookie|setcookie|apikey|traktapikey|clientid|clientsecret|accesstoken|refreshtoken|idtoken|token|secret|password|devicecode|code)$/i;

function isSensitiveName(name: string): boolean {
  const compact = name.replaceAll(/[^a-z0-9]/gi, '');
  return SENSITIVE_NAME.test(compact) ||
    /(?:token|secret|apikey|password)$/i.test(compact);
}

export function redactResponse({
  body,
  isJson,
  headers,
  secrets,
}: {
  body: string;
  isJson: boolean;
  headers: ReadonlyArray<{ name: string; value: string }>;
  secrets: ReadonlyArray<string | undefined>;
}): { body: string; headers: Array<{ name: string; value: string }> } {
  const values = secrets.filter((value): value is string => Boolean(value))
    .flatMap((value) => [value, encodeURIComponent(value)])
    .sort((a, b) => b.length - a.length);

  const redactText = (text: string): string =>
    values.reduce((result, value) => result.replaceAll(value, REDACTED), text)
      .replaceAll(/\bBearer\s+[^\s"'<>]+/gi, 'Bearer ' + REDACTED)
      .replaceAll(
        /([?&](?:access_token|refresh_token|client[_-]?(?:secret|id)|api_key|token|code)=)[^&#\s]*/gi,
        '$1' + REDACTED,
      );

  function redactJson(value: unknown): unknown {
    if (typeof value === 'string') return redactText(value);
    if (Array.isArray(value)) return value.map(redactJson);
    if (typeof value !== 'object' || value === null) return value;

    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        redactText(key),
        isSensitiveName(key) ? REDACTED : redactJson(entry),
      ]),
    );
  }

  const redactBody = (): string => {
    if (isJson) {
      try {
        return JSON.stringify(redactJson(JSON.parse(body)), null, 2);
      } catch {
        return '[Invalid JSON response omitted]';
      }
    }

    if (
      /(?:bearer\s|access[_-]?token|refresh[_-]?token|client[_-]?(?:id|secret)|api[_-]?key|authorization|password)/i
        .test(body)
    ) {
      return '[Sensitive non-JSON response omitted]';
    }

    return redactText(body);
  };

  return {
    body: redactBody(),
    headers: headers.map(({ name, value }) => ({
      name: redactText(name),
      value: isSensitiveName(name) ? REDACTED : redactText(value),
    })),
  };
}
