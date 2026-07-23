import type { OperationObject } from 'openapi3-ts';
import { generate } from './generate.ts';

function assertEquals(actual: unknown, expected: unknown): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, received ${
        JSON.stringify(actual)
      }`,
    );
  }
}

function getOperations(): OperationObject[] {
  return Object.values(generate().paths).flatMap((path) =>
    Object.values(path ?? {}).filter((value): value is OperationObject =>
      typeof value === 'object' && value !== null && 'responses' in value
    )
  );
}

Deno.test('uses the API host by default', () => {
  const document = generate();
  const apiOperation = document.paths['/movies/trending']?.get;

  assertEquals(document.servers?.[0]?.url, 'https://api.trakt.tv');
  assertEquals(apiOperation?.servers, undefined);
});

Deno.test('uses the auth host for every OAuth endpoint', () => {
  const oauthOperations = getOperations().filter((operation) =>
    operation.tags?.includes('oauth')
  );

  assertEquals(oauthOperations.length > 0, true);
  for (const operation of oauthOperations) {
    assertEquals(operation.servers, [{
      url: 'https://auth.trakt.tv',
      description: 'Authentication',
    }]);
  }
});

Deno.test('uses the auth host for the OAuth2 flow URLs', () => {
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
