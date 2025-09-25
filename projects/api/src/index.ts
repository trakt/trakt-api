import { initClient } from '@ts-rest/core';
import { traktContract } from './contracts/traktContract.ts';
import { Environment } from './Environment.ts';

export * from './contracts/calendars/index.ts';
export * from './contracts/certifications/index.ts';
export * from './contracts/checkin/index.ts';
export * from './contracts/comments/index.ts';
export * from './contracts/enums/index.ts';
export * from './contracts/lists/index.ts';
export * from './contracts/models/index.ts';
export * from './contracts/movies/index.ts';
export * from './contracts/oauth/index.ts';
export * from './contracts/people/index.ts';
export * from './contracts/recommendations/index.ts';
export * from './contracts/scrobble/index.ts';
export * from './contracts/search/index.ts';
export * from './contracts/shows/index.ts';
export * from './contracts/sync/index.ts';
export * from './contracts/users/index.ts';
export * from './contracts/watchnow/index.ts';

export { Environment, traktContract };

export type TraktApiOptions = {
  /**
   * Trakt API environment target (production, staging, development)
   */
  environment:
    | Environment
    | `https://${string}`
    | `http://localhost:${string}`
    | 'http://localhost';
  /**
   * Trakt API key (client id from trakt.tv API application)
   */
  apiKey: string;
  /**
   * Fetch implementation
   */
  fetch?: typeof fetch;
  /**
   * If the request can be cancelled
   */
  cancellable?: boolean;

  /**
   * Cancellation id for the request
   */
  cancellationId?: string;
};

export type TraktApi = ReturnType<typeof traktApiFactory>;

const controllers = new Map<string, AbortController>();

export class AbortError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AbortError';
  }
}

function createCancellationHandler(cancellable: boolean, id: string) {
  if (!cancellable) {
    return {
      signal: () => undefined,
      abort: () => undefined,
      finalize: () => undefined,
    };
  }

  function abort() {
    if (controllers.has(id)) {
      controllers.get(id)?.abort?.(
        new AbortError(
          `New request with id ${id} has been made, in-flight request aborted.`,
        ),
      );
    }
  }

  function finalize() {
    controllers.delete(id);
  }

  return {
    signal: () => {
      const controller = new AbortController();
      controllers.set(id, controller);
      return controller.signal;
    },
    abort,
    finalize,
  };
}

export function abortRequest(matcher: (id: string) => boolean, reason: Error) {
  for (const [id, controller] of controllers) {
    if (!matcher(id)) {
      continue;
    }

    controller.abort(reason);
  }
}

export function traktApiFactory({
  environment,
  apiKey,
  fetch = globalThis.fetch,
  cancellable,
  cancellationId,
}: TraktApiOptions) {
  return initClient(traktContract, {
    baseUrl: environment,
    baseHeaders: {
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': apiKey,
    },
    api: async ({ path, method, body, headers }) => {
      cancellationId = cancellationId ?? path.split('?').at(0) ?? '';

      const handler = createCancellationHandler(
        Boolean(cancellable),
        cancellationId,
      );
      handler.abort();

      const result = await fetch(path, {
        method,
        headers,
        body,
        signal: handler.signal(),
      });

      handler.finalize();

      const contentType = result.headers.get('content-type');

      if (
        contentType?.includes('application/') && contentType?.includes('json')
      ) {
        const responseText = await result.text();

        const response = {
          status: result.status,
          body: responseText ? JSON.parse(responseText) : undefined,
          headers: result.headers,
        };

        return response;
      }

      if (contentType?.includes('text/')) {
        return {
          status: result.status,
          body: await result.text(),
          headers: result.headers,
        };
      }

      return {
        status: result.status,
        body: await result.blob(),
        headers: result.headers,
      };
    },
  });
}

export function traktApi({
  environment = Environment.production,
  apiKey,
  fetch,
  cancellable,
  cancellationId,
}: TraktApiOptions): TraktApi {
  return traktApiFactory({
    environment,
    apiKey,
    fetch,
    cancellable,
    cancellationId,
  });
}
