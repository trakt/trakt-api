import type { ApiHeader } from '$lib/api/ApiHeader.ts';
import { MANAGED_AUTHORIZATION_HEADER_ID } from '$lib/api/headerIds.ts';
import type { Endpoint } from '$lib/openapi/Endpoint.ts';
import type { RequestEditorTab } from './RequestEditorProps.ts';

export type RequestUrlState = {
  endpointId: string;
  mainServerUrl: string;
  serverUrl: string;
  values: Readonly<Record<string, string>>;
  headers: ReadonlyArray<ApiHeader>;
  authorizationEnabled: boolean;
  body: string;
  activeTab: RequestEditorTab;
};

const FRAGMENT_VERSION = '1';
const PARAMETER_PREFIX = 'param.';
const HEADER_PREFIX = 'header.';
const SENSITIVE_FIELD_NAMES = new Set([
  'access_token',
  'api_key',
  'authorization',
  'client_id',
  'client_secret',
  'code',
  'cookie',
  'device_code',
  'password',
  'proxy_authorization',
  'refresh_token',
  'secret',
  'set_cookie',
  'token',
  'trakt_api_key',
]);
const SENSITIVE_COMPACT_FIELD_NAMES = new Set(
  [...SENSITIVE_FIELD_NAMES].map((name) => name.replaceAll('_', '')),
);

function normalizedFieldName(value: string): string {
  return value.trim().toLocaleLowerCase().replaceAll(/[^a-z0-9]+/g, '_')
    .replaceAll(/^_+|_+$/g, '');
}

function isSensitiveFieldName(value: string): boolean {
  const name = normalizedFieldName(value);
  const compactName = name.replaceAll('_', '');
  return SENSITIVE_FIELD_NAMES.has(name) ||
    SENSITIVE_COMPACT_FIELD_NAMES.has(compactName) ||
    name.endsWith('_secret') ||
    name.endsWith('_token') || name.endsWith('_api_key');
}

function sanitizeJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeJsonValue);
  if (typeof value !== 'object' || value === null) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      isSensitiveFieldName(key) ? '' : sanitizeJsonValue(entry),
    ]),
  );
}

function sanitizeBody(body: string): string {
  try {
    return JSON.stringify(sanitizeJsonValue(JSON.parse(body)), null, 2);
  } catch {
    return [...SENSITIVE_FIELD_NAMES].some((name) =>
        normalizedFieldName(body).includes(name)
      )
      ? ''
      : body;
  }
}

function safeHeaders(
  headers: ReadonlyArray<ApiHeader>,
): ReadonlyArray<ApiHeader> {
  return headers
    .filter((header) =>
      header.managed !== true && !header.id.startsWith('managed-') &&
      !isSensitiveFieldName(header.name) &&
      !/^(?:basic|bearer)\s+/i.test(header.value.trim())
    )
    .map(({ id, name, value, enabled }) => ({ id, name, value, enabled }));
}

function safeValues({
  endpoint,
  values,
}: {
  endpoint: Endpoint;
  values: Readonly<Record<string, string>>;
}): Readonly<Record<string, string>> {
  return Object.fromEntries(
    endpoint.parameters
      .filter((parameter) => !isSensitiveFieldName(parameter.name))
      .map((parameter) => [parameter.id, values[parameter.id] ?? '']),
  );
}

export function encodeRequestUrlState({
  endpoint,
  mainServerUrl,
  serverUrl,
  values,
  headers,
  body,
  activeTab,
}: {
  endpoint: Endpoint;
  mainServerUrl: string;
  serverUrl: string;
  values: Readonly<Record<string, string>>;
  headers: ReadonlyArray<ApiHeader>;
  body: string;
  activeTab: RequestEditorTab;
}): string {
  const parameterEntries = Object.entries(safeValues({ endpoint, values })).map(
    ([id, value]): [string, string] => [`${PARAMETER_PREFIX}${id}`, value],
  );
  const headerEntries = safeHeaders(headers).flatMap(
    (header, index): Array<[string, string]> => [
      [`${HEADER_PREFIX}${index}.id`, header.id],
      [`${HEADER_PREFIX}${index}.name`, header.name],
      [`${HEADER_PREFIX}${index}.value`, header.value],
      [`${HEADER_PREFIX}${index}.enabled`, header.enabled ? '1' : '0'],
    ],
  );

  const parameters = new URLSearchParams([
    ['v', FRAGMENT_VERSION],
    ['endpoint', endpoint.id],
    ['mainServer', mainServerUrl],
    ['server', serverUrl],
    ...parameterEntries,
    ...headerEntries,
    [
      'authorization',
      headers.find(({ id }) => id === MANAGED_AUTHORIZATION_HEADER_ID)
          ?.enabled ===
          false
        ? '0'
        : '1',
    ],
    ['body', sanitizeBody(body)],
    ['tab', activeTab],
  ]);

  return `#${parameters.toString()}`;
}

export function decodeRequestUrlState(
  fragment: string,
): RequestUrlState | null {
  if (!fragment.startsWith('#')) return null;

  const parameters = new URLSearchParams(fragment.slice(1));
  const endpointId = parameters.get('endpoint');
  const serverUrl = parameters.get('server');
  const body = parameters.get('body');
  const activeTab = parameters.get('tab');

  if (parameters.get('v') !== FRAGMENT_VERSION) return null;
  if (endpointId === null || serverUrl === null) return null;
  if (body === null || activeTab === null) return null;
  const mainServerUrl = parameters.get('mainServer') ?? serverUrl;

  const values = Object.fromEntries(
    [...parameters.entries()]
      .filter(([key]) => key.startsWith(PARAMETER_PREFIX))
      .map(([key, value]) => [key.slice(PARAMETER_PREFIX.length), value]),
  );

  const headerIndexes = [
    ...new Set([...parameters.keys()].flatMap((key) => {
      const match = /^header\.(\d+)\./.exec(key);
      const index = Number(match?.at(1));
      return Number.isInteger(index) ? [index] : [];
    })),
  ].sort((left, right) => left - right);
  const headers = headerIndexes.flatMap((index): Array<ApiHeader> => {
    const id = parameters.get(`${HEADER_PREFIX}${index}.id`);
    const name = parameters.get(`${HEADER_PREFIX}${index}.name`);
    const value = parameters.get(`${HEADER_PREFIX}${index}.value`);
    const enabled = parameters.get(`${HEADER_PREFIX}${index}.enabled`);
    if (id === null || name === null || value === null || enabled === null) {
      return [];
    }

    return [{ id, name, value, enabled: enabled === '1' }];
  });

  return {
    endpointId,
    mainServerUrl,
    serverUrl,
    values,
    headers: safeHeaders(headers),
    authorizationEnabled: parameters.get('authorization') !== '0',
    body: sanitizeBody(body),
    activeTab: activeTab as RequestEditorTab,
  };
}
