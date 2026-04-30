import type { SecurityRequirementObject } from 'openapi3-ts';
import { Environment, traktContract } from '@trakt/api';
import { generateOpenApi } from './generateOpenApi.ts';

type AuthRequirement = 'none' | 'optional' | 'required';

const authRequirements = new Set<AuthRequirement>([
  'none',
  'optional',
  'required',
]);

function getAuthRequirement(
  metadata: unknown,
  tags: string[],
): AuthRequirement {
  if (metadata && typeof metadata === 'object' && 'auth' in metadata) {
    const auth = (metadata as Record<string, unknown>).auth;
    if (
      typeof auth === 'string' && authRequirements.has(auth as AuthRequirement)
    ) {
      return auth as AuthRequirement;
    }
  }

  // Backwards-compatible fallback while route metadata rollout is ongoing.
  return tags.includes('oauth') ? 'none' : 'optional';
}

function getSecurityFromAuth(
  auth: AuthRequirement,
): SecurityRequirementObject[] {
  switch (auth) {
    case 'none':
      return [{ traktAPI: [] }];
    case 'required':
      return [{ traktAPI: [], traktOAuth: [] }];
    case 'optional':
      return [{ traktAPI: [], traktOAuth: [] }, { traktAPI: [] }];
  }
}

const servers = [
  {
    url: Environment.production,
    description: 'Production',
  },
  {
    url: Environment.staging,
    description: 'Staging',
  },
  {
    url: Environment.production_private,
    description: 'Private production',
  },
];

export function generate(): ReturnType<typeof generateOpenApi> {
  return generateOpenApi(
    traktContract,
    {
      info: {
        title: 'Trakt API',
        version: '2.0.0',
      },
      servers,
      components: {
        securitySchemes: {
          traktAPI: {
            type: 'apiKey',
            in: 'header',
            name: 'trakt-api-key',
          },
          traktOAuth: {
            type: 'oauth2',
            flows: {
              authorizationCode: {
                authorizationUrl: 'https://trakt.tv/oauth/authorize',
                tokenUrl: 'https://api.trakt.tv/oauth/token',
                scopes: {
                  public: 'Access public data',
                },
              },
            },
          },
        },
      },
      'x-readme': {
        headers: [
          {
            key: 'User-Agent',
            value: 'readme/1.0',
          },
          {
            key: 'trakt-api-version',
            value: '2',
          },
        ],
      },
    },
    {
      operationMapper: (operation, route, id) => {
        const parts = [
          ...(operation.tags ?? []),
          id,
        ];

        const auth = getAuthRequirement(route.metadata, operation.tags ?? []);

        return {
          ...operation,
          security: getSecurityFromAuth(auth),
          operationId: `${route.method.toLowerCase()}${
            parts
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join('')
          }`,
        };
      },
    },
  );
}

if (import.meta.main) {
  await Deno.writeTextFile('openapi.json', JSON.stringify(generate(), null, 2));
}
