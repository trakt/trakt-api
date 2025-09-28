import { traktContract } from '@trakt/api';
import { generateOpenApi } from '@ts-rest/open-api';

export function generate(): ReturnType<typeof generateOpenApi> {
  return generateOpenApi(traktContract, {
    info: {
      title: 'Trakt API',
      version: '2.0.0',
    },
  }, {
    operationMapper: (operation, route, id) => {
      const parts = [
        ...(operation.tags ?? []),
        id,
      ];

      return {
        ...operation,
        operationId: `${route.method.toLowerCase()}${parts
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join('')
          }`,
      };
    },
  });
}

if (import.meta.main) {
  await Deno.writeTextFile('openapi.json', JSON.stringify(generate(), null, 2));
}
