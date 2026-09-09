import type { Endpoint } from './Endpoint.ts';

export function buildEndpointUrl({
  endpoint,
  serverUrl,
  values,
}: {
  endpoint: Endpoint;
  serverUrl: string;
  values: Readonly<Record<string, string>>;
}): string {
  const pathParameters = endpoint.parameters.filter(
    (parameter) => parameter.location === 'path',
  );
  const missingRequiredPathParameters = pathParameters.filter(
    (parameter) => parameter.required && !values[parameter.id]?.trim(),
  );
  const path = pathParameters.reduce((result, parameter) => {
    const value = values[parameter.id] ?? '';
    const replacement = parameter.required && !value.trim()
      ? `{${parameter.name}}`
      : encodeURIComponent(value);

    return result.replaceAll(`{${parameter.name}}`, replacement);
  }, endpoint.path);
  const url = new URL(path, `${serverUrl.replace(/\/$/, '')}/`);

  endpoint.parameters
    .filter((parameter) => parameter.location === 'query')
    .forEach((parameter) => {
      const value = values[parameter.id]?.trim();
      if (value) url.searchParams.set(parameter.name, value);
    });

  return missingRequiredPathParameters.reduce(
    (href, parameter) =>
      href.replaceAll(
        encodeURIComponent(`{${parameter.name}}`),
        `{${parameter.name}}`,
      ),
    url.href,
  );
}
