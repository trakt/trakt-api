# @trakt/api

Fully typed [ts-rest](https://ts-rest.com) contract and client for the
[Trakt API](https://trakt.docs.apiary.io), backed by Zod schemas.

`traktApi()` returns a client with precise request/response types for every
endpoint. The individual Zod schemas and inferred model types are also exported
for validation and reuse.

## Install

```sh
deno add jsr:@trakt/api
```

## Usage

```ts
import { traktApi } from '@trakt/api';

const client = traktApi({ apiKey: '<client-id>' });

const res = await client.movies.summary({ params: { id: 'tron-legacy-2010' } });
if (res.status === 200) {
  console.log(res.body.title); // fully typed
}
```

### Environment

By default the client targets production. Pass an `environment` to override:

```ts
import { Environment, traktApi } from '@trakt/api';

const staging = traktApi({
  apiKey: '<client-id>',
  environment: Environment.staging,
});
```

### Cancellation

Pass `cancellable: true` so a newer request with the same `cancellationId`
aborts the in-flight one:

```ts
const client = traktApi({ apiKey: '<client-id>', cancellable: true });
```

## Schemas and types

Every endpoint's request and response is a Zod schema, and the inferred model
types are exported alongside the contract:

```ts
import { type MovieResponse, movieResponseSchema } from '@trakt/api';

const movie: MovieResponse = movieResponseSchema.parse(await someFetch());
```

## Contract

The raw ts-rest contract is exported as `traktContract` for use with any
ts-rest-compatible server or client.
