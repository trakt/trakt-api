import type { ApiHeader } from '$lib/api/ApiHeader.ts';
import type { Endpoint } from '$lib/openapi/Endpoint.ts';
import { FRAGMENT_VERSION } from './FRAGMENT_VERSION.ts';
import { HEADER_PREFIX } from './HEADER_PREFIX.ts';
import { isSensitiveFieldName } from './isSensitiveFieldName.ts';
import { PARAMETER_PREFIX } from './PARAMETER_PREFIX.ts';
import type { RequestEditorTab } from './RequestEditorTab.ts';
import { safeHeaders } from './safeHeaders.ts';
import { sanitizeBody } from './sanitizeBody.ts';

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
  authorizationEnabled,
  body,
  activeTab,
}: {
  endpoint: Endpoint;
  mainServerUrl: string;
  serverUrl: string;
  values: Readonly<Record<string, string>>;
  headers: ReadonlyArray<ApiHeader>;
  authorizationEnabled: boolean;
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
    ['authorization', authorizationEnabled ? '1' : '0'],
    ['body', sanitizeBody(body)],
    ['tab', activeTab],
  ]);

  return `#${parameters.toString()}`;
}
