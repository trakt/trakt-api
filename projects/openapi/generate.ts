import { traktContract } from '@trakt/api';
import { generateOpenApi } from './generateOpenApi.ts';

export function generate(): ReturnType<typeof generateOpenApi> {
  return generateOpenApi(
    traktContract,
    {
      info: {
        title: 'Trakt API',
        version: '2.0.0',
      },
      components: {
        securitySchemes: {
          traktOAuth: {
            type: 'oauth2',
            flows: {
              authorizationCode: {
                authorizationUrl: 'https://api.trakt.tv/oauth/authorize',
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

        const isOAuthRoute = (operation.tags ?? []).includes('oauth');

        const security = isOAuthRoute
          ? []
          : [
            {
              traktOAuth: [],
            },
            {},
          ];

        return {
          ...operation,
          security,
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
