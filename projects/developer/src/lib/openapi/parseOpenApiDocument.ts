import type { Endpoint, EndpointRequestBody } from './Endpoint.ts';
import type { EndpointParameter } from './EndpointParameter.ts';
import type { HttpMethod } from './HttpMethod.ts';
import type { OpenApiCatalog } from './OpenApiCatalog.ts';

type JsonObject = Record<string, unknown>;

const HTTP_METHODS: ReadonlyArray<HttpMethod> = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
];

function asObject(value: unknown): JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as JsonObject
    : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function asArray(value: unknown): ReadonlyArray<unknown> {
  return Array.isArray(value) ? value : [];
}

function resolveReference({
  root,
  value,
}: {
  root: JsonObject;
  value: unknown;
}): JsonObject {
  const object = asObject(value);
  const reference = asString(object.$ref);
  if (!reference.startsWith('#/')) return object;

  return reference.slice(2).split('/').reduce<JsonObject>(
    (current, segment) => asObject(current[segment]),
    root,
  );
}

function schemaType(schema: JsonObject): string {
  const directType = asString(schema.type);
  if (directType) return directType;

  const unionType = asArray(schema.type)
    .map((value) => asString(value))
    .find((value) => value && value !== 'null');
  if (unionType) return unionType;
  if (Object.keys(asObject(schema.properties)).length > 0) return 'object';
  return 'string';
}

function toEditableValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return JSON.stringify(value);
}

function sampleFromSchema({
  root,
  schemaValue,
  depth = 0,
  references = new Set<string>(),
}: {
  root: JsonObject;
  schemaValue: unknown;
  depth?: number;
  references?: ReadonlySet<string>;
}): unknown {
  if (depth > 7) return null;

  const initial = asObject(schemaValue);
  const reference = asString(initial.$ref);
  if (reference && references.has(reference)) return null;

  const nextReferences = reference
    ? new Set([...references, reference])
    : references;
  const schema = resolveReference({ root, value: initial });

  if ('example' in schema) return schema.example;
  if ('default' in schema) return schema.default;

  const enumValue = asArray(schema.enum).at(0);
  if (enumValue !== undefined) return enumValue;

  const composition = asArray(schema.oneOf).at(0) ??
    asArray(schema.anyOf).at(0);
  if (composition) {
    return sampleFromSchema({
      root,
      schemaValue: composition,
      depth: depth + 1,
      references: nextReferences,
    });
  }

  const allOf = asArray(schema.allOf);
  if (allOf.length > 0) {
    return allOf.reduce<JsonObject>((result, item) => {
      const sample = sampleFromSchema({
        root,
        schemaValue: item,
        depth: depth + 1,
        references: nextReferences,
      });
      return { ...result, ...asObject(sample) };
    }, {});
  }

  switch (schemaType(schema)) {
    case 'object':
      return Object.fromEntries(
        Object.entries(asObject(schema.properties)).map(([name, property]) => [
          name,
          sampleFromSchema({
            root,
            schemaValue: property,
            depth: depth + 1,
            references: nextReferences,
          }),
        ]),
      );
    case 'array':
      return [
        sampleFromSchema({
          root,
          schemaValue: schema.items,
          depth: depth + 1,
          references: nextReferences,
        }),
      ];
    case 'integer':
    case 'number':
      return 0;
    case 'boolean':
      return false;
    default:
      return '';
  }
}

function schemaAllowsNull({
  root,
  schemaValue,
}: {
  root: JsonObject;
  schemaValue: unknown;
}): boolean {
  const schema = resolveReference({ root, value: schemaValue });
  if (asBoolean(schema.nullable)) return true;
  if (asArray(schema.type).some((type) => type === 'null')) return true;

  return [...asArray(schema.oneOf), ...asArray(schema.anyOf)].some(
    (candidate) => schemaAllowsNull({ root, schemaValue: candidate }),
  );
}

function requiredSampleFromSchema({
  root,
  schemaValue,
  sampleValue,
  depth = 0,
  references = new Set<string>(),
}: {
  root: JsonObject;
  schemaValue: unknown;
  sampleValue: unknown;
  depth?: number;
  references?: ReadonlySet<string>;
}): unknown {
  if (depth > 7) return null;

  const initial = asObject(schemaValue);
  const reference = asString(initial.$ref);
  if (reference && references.has(reference)) return null;

  const nextReferences = reference
    ? new Set([...references, reference])
    : references;
  const schema = resolveReference({ root, value: initial });
  const composition = [
    ...asArray(schema.oneOf),
    ...asArray(schema.anyOf),
  ].find((candidate) => !schemaAllowsNull({ root, schemaValue: candidate }));

  if (composition) {
    return requiredSampleFromSchema({
      root,
      schemaValue: composition,
      sampleValue,
      depth: depth + 1,
      references: nextReferences,
    });
  }

  const allOf = asArray(schema.allOf);
  if (allOf.length > 0) {
    return allOf.reduce<JsonObject>((result, item) => ({
      ...result,
      ...asObject(requiredSampleFromSchema({
        root,
        schemaValue: item,
        sampleValue,
        depth: depth + 1,
        references: nextReferences,
      })),
    }), {});
  }

  if (schemaType(schema) === 'object') {
    const requiredNames = new Set(
      asArray(schema.required).map((name) => asString(name)).filter(Boolean),
    );
    const sample = asObject(sampleValue);

    return Object.fromEntries(
      Object.entries(asObject(schema.properties)).flatMap(
        ([name, property]) => {
          if (
            !requiredNames.has(name) ||
            schemaAllowsNull({ root, schemaValue: property })
          ) return [];

          const propertySample = name in sample
            ? sample[name]
            : sampleFromSchema({ root, schemaValue: property });
          const value = requiredSampleFromSchema({
            root,
            schemaValue: property,
            sampleValue: propertySample,
            depth: depth + 1,
            references: nextReferences,
          });

          return value === undefined ? [] : [[name, value]];
        },
      ),
    );
  }

  if (schemaType(schema) === 'array') {
    const itemSample = asArray(sampleValue).at(0) ??
      sampleFromSchema({ root, schemaValue: schema.items });
    const item = requiredSampleFromSchema({
      root,
      schemaValue: schema.items,
      sampleValue: itemSample,
      depth: depth + 1,
      references: nextReferences,
    });

    return item === undefined ? [] : [item];
  }

  return sampleValue ?? sampleFromSchema({ root, schemaValue });
}

function parseParameter({
  root,
  value,
}: {
  root: JsonObject;
  value: unknown;
}): EndpointParameter | null {
  const parameter = resolveReference({ root, value });
  const name = asString(parameter.name);
  const location = asString(parameter.in);
  if (!name || !['path', 'query', 'header'].includes(location)) return null;

  const schema = resolveReference({ root, value: parameter.schema });
  const defaultValue = parameter.example ?? schema.example ?? schema.default ??
    asArray(schema.enum).at(0);

  return {
    id: `${location}:${name}`,
    name,
    location: location as EndpointParameter['location'],
    required: location === 'path' || asBoolean(parameter.required),
    description: asString(parameter.description),
    type: schemaType(schema),
    enumValues: asArray(schema.enum).map((entry) => asString(entry)).filter(
      Boolean,
    ),
    defaultValue: toEditableValue(defaultValue),
  };
}

function parseParameters({
  root,
  pathItem,
  operation,
}: {
  root: JsonObject;
  pathItem: JsonObject;
  operation: JsonObject;
}): ReadonlyArray<EndpointParameter> {
  const merged = [
    ...asArray(pathItem.parameters),
    ...asArray(operation.parameters),
  ]
    .map((value) => parseParameter({ root, value }))
    .filter((value): value is EndpointParameter => value !== null);

  return [
    ...new Map(merged.map((parameter) => [parameter.id, parameter])).values(),
  ];
}

function parseRequestBody({
  root,
  operation,
}: {
  root: JsonObject;
  operation: JsonObject;
}): EndpointRequestBody | null {
  const body = resolveReference({ root, value: operation.requestBody });
  const content = asObject(body.content);
  const contentType =
    Object.keys(content).find((type) => type.includes('json')) ??
      Object.keys(content).at(0);

  if (!contentType) return null;

  const media = asObject(content[contentType]);
  const sample = media.example ?? sampleFromSchema({
    root,
    schemaValue: media.schema,
  });

  return {
    required: asBoolean(body.required),
    description: asString(body.description),
    contentType,
    example: JSON.stringify(sample ?? {}, null, 2),
  };
}

function parseAuth({
  root,
  operation,
  isOAuthEndpoint,
}: {
  root: JsonObject;
  operation: JsonObject;
  isOAuthEndpoint: boolean;
}): Endpoint['auth'] {
  if (isOAuthEndpoint) return 'endpoint';

  const security = 'security' in operation
    ? asArray(operation.security)
    : asArray(root.security);

  if (security.length === 0) return 'optional';

  const securitySchemes = asObject(asObject(root.components).securitySchemes);
  const oauthSchemeNames = new Set(
    Object.entries(securitySchemes)
      .filter(([, value]) => {
        const scheme = resolveReference({ root, value });
        return ['oauth2', 'openIdConnect'].includes(asString(scheme.type));
      })
      .map(([name]) => name),
  );
  const alternativeRequiresOAuth = (requirement: unknown) =>
    Object.keys(asObject(requirement)).some((name) =>
      oauthSchemeNames.has(name)
    );

  if (!security.some(alternativeRequiresOAuth)) return 'optional';
  return security.every(alternativeRequiresOAuth) ? 'required' : 'optional';
}

function parseResponses({
  root,
  operation,
}: {
  root: JsonObject;
  operation: JsonObject;
}): Endpoint['responses'] {
  return Object.entries(asObject(operation.responses)).map(
    ([status, value]) => {
      const response = resolveReference({ root, value });
      const content = asObject(response.content);
      const contentType =
        Object.keys(content).find((type) => type.includes('json')) ??
          Object.keys(content).at(0) ?? '';
      const media = asObject(content[contentType]);
      const exampleEntry = asArray(Object.values(asObject(media.examples)))
        .at(0);
      const exampleObject = resolveReference({ root, value: exampleEntry });
      const schema = resolveReference({ root, value: media.schema });
      const explicitExample = media.example ?? exampleObject.value;
      const sample = explicitExample ??
        (Object.keys(schema).length > 0
          ? sampleFromSchema({ root, schemaValue: media.schema })
          : undefined);
      const requiredSample = Object.keys(schema).length > 0
        ? requiredSampleFromSchema({
          root,
          schemaValue: media.schema,
          sampleValue: sample,
        })
        : sample;

      const headers = Object.entries(asObject(response.headers)).map(
        ([name, headerValue]) => {
          const header = resolveReference({ root, value: headerValue });
          const headerSchema = resolveReference({ root, value: header.schema });
          const example = header.example ?? headerSchema.example ??
            headerSchema.default;

          return {
            name,
            description: asString(header.description),
            example: example === undefined ? '' : String(example),
          };
        },
      );

      return {
        status,
        description: asString(response.description, 'Response'),
        contentType,
        headers,
        example: sample === undefined
          ? ''
          : typeof sample === 'string' && !contentType.includes('json')
          ? sample
          : JSON.stringify(sample, null, 2),
        requiredExample: requiredSample === undefined
          ? ''
          : typeof requiredSample === 'string' &&
              !contentType.includes('json')
          ? requiredSample
          : JSON.stringify(requiredSample, null, 2),
      };
    },
  );
}

function parseServers({
  root,
  pathItem,
  operation,
}: {
  root: JsonObject;
  pathItem: JsonObject;
  operation: JsonObject;
}): ReadonlyArray<string> {
  const declared = asArray(operation.servers).length > 0
    ? asArray(operation.servers)
    : asArray(pathItem.servers).length > 0
    ? asArray(pathItem.servers)
    : asArray(root.servers);

  return declared.map((server) => asString(asObject(server).url)).filter(
    Boolean,
  );
}

function parseEndpoint({
  root,
  method,
  path,
  pathItem,
}: {
  root: JsonObject;
  method: HttpMethod;
  path: string;
  pathItem: JsonObject;
}): Endpoint | null {
  const operation = asObject(pathItem[method.toLowerCase()]);
  if (Object.keys(operation).length === 0) return null;

  const operationId = asString(operation.operationId, `${method}:${path}`);
  const summary = asString(operation.summary, operationId);
  const serverUrls = parseServers({ root, pathItem, operation });

  return {
    id: operationId,
    method,
    path,
    summary,
    description: asString(operation.description),
    operationId,
    tags: asArray(operation.tags).map((tag) => asString(tag)).filter(Boolean),
    deprecated: asBoolean(operation.deprecated),
    auth: parseAuth({
      root,
      operation,
      isOAuthEndpoint: serverUrls.some((url) =>
        url === 'https://auth.trakt.tv'
      ),
    }),
    parameters: parseParameters({ root, pathItem, operation }),
    requestBody: parseRequestBody({ root, operation }),
    responses: parseResponses({ root, operation }),
    serverUrls,
  };
}

export function parseOpenApiDocument({
  document,
  source,
}: {
  document: unknown;
  source: string;
}): OpenApiCatalog {
  const root = asObject(document);
  const info = asObject(root.info);
  const endpoints = Object.entries(asObject(root.paths)).flatMap(
    ([path, value]) => {
      const pathItem = asObject(value);
      return HTTP_METHODS.map((method) =>
        parseEndpoint({ root, method, path, pathItem })
      ).filter((endpoint): endpoint is Endpoint => endpoint !== null);
    },
  );

  if (!asString(root.openapi) || endpoints.length === 0) {
    throw new Error('The document is not a usable OpenAPI specification.');
  }

  return {
    title: asString(info.title, 'Trakt API'),
    apiVersion: asString(info.version),
    openApiVersion: asString(root.openapi),
    source,
    endpoints,
  };
}
