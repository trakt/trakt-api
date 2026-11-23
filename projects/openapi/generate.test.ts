import { test } from 'bun:test';
import type { OperationObject } from 'openapi3-ts';
import { generate } from './generate.ts';

function assertEquals(actual: unknown, expected: unknown): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, received ${JSON.stringify(
        actual,
      )}`,
    );
  }
}

function getOperations(): OperationObject[] {
  return Object.values(generate().paths).flatMap((path) =>
    Object.values(path ?? {}).filter(
      (value): value is OperationObject =>
        typeof value === 'object' && value !== null && 'responses' in value,
    ),
  );
}

test('uses the API host by default', () => {
  const document = generate();
  const apiOperation = document.paths['/movies/trending']?.get;

  assertEquals(document.servers, [
    {
      url: 'https://api.trakt.tv',
      description: 'Production',
    },
    {
      url: 'https://apiz.trakt.tv',
      description: 'Private production',
    },
  ]);
  assertEquals(apiOperation?.servers, undefined);
});

test('uses the auth host for every OAuth endpoint', () => {
  const oauthOperations = getOperations().filter((operation) =>
    operation.tags?.includes('oauth'),
  );

  assertEquals(oauthOperations.length > 0, true);
  for (const operation of oauthOperations) {
    assertEquals(operation.servers, [
      {
        url: 'https://auth.trakt.tv',
        description: 'Authentication',
      },
    ]);
  }
});

test('uses the auth host for the OAuth2 flow URLs', () => {
  const document = generate();
  const oauth2 = document.components?.securitySchemes?.traktOAuth;

  if (!oauth2 || !('flows' in oauth2) || !oauth2.flows) {
    throw new Error('Expected the traktOAuth OAuth2 security scheme');
  }

  assertEquals(
    oauth2.flows.authorizationCode?.authorizationUrl,
    'https://auth.trakt.tv/oauth/authorize',
  );
  assertEquals(
    oauth2.flows.authorizationCode?.tokenUrl,
    'https://auth.trakt.tv/oauth/token',
  );
});

test('types every query parameter', () => {
  const untyped = Object.entries(generate().paths).flatMap(([path, item]) =>
    Object.values(item ?? {}).flatMap((operation) => {
      const parameters = (operation as OperationObject).parameters ?? [];
      return parameters.flatMap((parameter) => {
        if ('$ref' in parameter) return [];
        const schema = parameter.schema ?? {};
        const isTyped = ['type', '$ref', 'oneOf', 'anyOf', 'allOf'].some(
          (key) => key in schema,
        );
        return isTyped ? [] : [`${path} ${parameter.name}`];
      });
    }),
  );

  assertEquals(untyped, []);
});

function int64Types(node: unknown): string[] {
  if (Array.isArray(node)) return node.flatMap(int64Types);
  if (typeof node !== 'object' || node === null) return [];
  const schema = node as Record<string, unknown>;
  const own = schema.format === 'int64' ? [String(schema.type)] : [];

  return [...own, ...Object.values(schema).flatMap(int64Types)];
}

test('emits int64 fields as integers', () => {
  const types = int64Types(generate().paths);

  assertEquals(types.length > 0, true);
  assertEquals(
    types.filter((type) => type !== 'integer'),
    [],
  );
});

test('describes the search score as a double', () => {
  const response = generate().paths['/search/{type}']?.get?.responses?.['200'];
  const schema = response as unknown as {
    content: {
      'application/json': {
        schema: { items: { properties: { score: unknown } } };
      };
    };
  };
  const { score } = schema.content['application/json'].schema.items.properties;

  assertEquals(score, { type: 'number', format: 'double' });
});

test('lists the 204 on movie and show sentiments', () => {
  const paths = generate().paths;

  assertEquals(
    Object.keys(paths['/movies/{id}/sentiments']?.get?.responses ?? {}),
    ['200', '204'],
  );
  assertEquals(
    Object.keys(paths['/shows/{id}/sentiments']?.get?.responses ?? {}),
    ['200', '204'],
  );
});
