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

function getSecurityFromAuth(auth: AuthRequirement) {
  switch (auth) {
    case 'none':
      return [];
    case 'required':
      return [{ traktOAuth: [] }];
    case 'optional':
      return [{ traktOAuth: [] }, {}];
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
