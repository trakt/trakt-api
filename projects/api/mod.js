/* @ts-self-types="./types/index.d.ts" */
/**
 * Fully typed [ts-rest](https://ts-rest.com) contract and client for the
 * [Trakt API](https://trakt.docs.apiary.io), backed by Zod schemas.
 *
 * `traktApi()` returns a client with precise request/response types for every
 * endpoint; the individual Zod schemas and inferred model types are also
 * exported for validation and reuse.
 *
 * @example
 * ```ts
 * import { traktApi } from '@trakt/api';
 *
 * const client = traktApi({ apiKey: '<client-id>' });
 *
 * const res = await client.movies.summary({ params: { id: 'tron-legacy-2010' } });
 * if (res.status === 200) {
 *   console.log(res.body.title); // fully typed
 * }
 * ```
 *
 * @module
 */

// This entry is `.js` (not `.ts`) on purpose: with the `@ts-self-types`
// directive above, JSR takes the module's types verbatim from the precomputed
// `./types` declaration tree instead of type-checking the source. That keeps
// the package free of "slow types" AND makes the npm compatibility layer point
// `package.json`'s `types` straight at `./types/index.d.ts` (a `.ts` entry
// would emit a `_dist` shim with a broken relative path). Runtime still comes
// from `./src/index.ts`; regenerate `./types` with `deno task build:types`.
export * from './src/index.ts';
