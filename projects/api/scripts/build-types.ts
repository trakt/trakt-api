/**
 * Generates static `.d.ts` declarations for the public API into `./types`.
 *
 * The contracts are built on Zod + ts-rest, whose fully-inferred types are
 * "slow types" for JSR (and force every consumer to re-derive them on each
 * type-check). This precomputes explicit declarations once, so `mod.ts` can
 * expose them via `@ts-types` and consumers get fast, static types.
 *
 * Uses dnt to resolve the Deno graph (npm:/jsr:/.ts specifiers) and run tsc
 * for declaration emit, then copies the declarations into `./types` and
 * rewrites relative `.js` import specifiers to `.d.ts` so the types resolve in
 * a declaration-only tree.
 */
import { build, emptyDir } from 'jsr:@deno/dnt@^0.42.1';
import { dirname, join, relative } from 'jsr:@std/path@^1.0.8';

const root = dirname(import.meta.dirname!);
const tmp = await Deno.makeTempDir({ prefix: 'trakt-api-dts-' });
const typesDir = join(root, 'types');

console.log('Emitting declarations via dnt...');
await build({
  entryPoints: [join(root, 'src/index.ts')],
  outDir: tmp,
  test: false,
  typeCheck: false,
  declaration: 'inline',
  scriptModule: false,
  esModule: true,
  skipSourceOutput: true,
  shims: {},
  package: { name: '@trakt/api', version: '0.0.0' },
  compilerOptions: { lib: ['ESNext', 'DOM'] },
  postBuild() {},
});

const esm = join(tmp, 'esm');
await emptyDir(typesDir);

// Rewrite relative `.js`/`.ts` specifiers to `.d.ts` (in both `from '...'`
// and inline `import("...")`), so declarations resolve in a types-only tree.
const rewrite = (src: string): string =>
  src.replace(
    /(['"])(\.[^'"]*?)\.(?:js|ts)\1/g,
    (_m, quote, path) => `${quote}${path}.d.ts${quote}`,
  );

let count = 0;
async function copyDeclarations(dir: string): Promise<void> {
  for await (const entry of Deno.readDir(dir)) {
    const from = join(dir, entry.name);
    if (entry.isDirectory) {
      await copyDeclarations(from);
    } else if (from.endsWith('.d.ts')) {
      const dest = join(typesDir, relative(esm, from));
      await Deno.mkdir(dirname(dest), { recursive: true });
      await Deno.writeTextFile(dest, rewrite(await Deno.readTextFile(from)));
      count++;
    }
  }
}
await copyDeclarations(esm);
await Deno.remove(tmp, { recursive: true });

// `mod.js` uses `@ts-self-types` to point at `types/index.d.ts`, so JSR reads
// the module doc from there - not from `mod.js`. tsc drops module-level JSDoc
// on emit, so prepend it back onto the generated entry declaration.
const moduleDoc = `/**
 * Fully typed [ts-rest](https://ts-rest.com) contract and client for the
 * [Trakt API](https://trakt.docs.apiary.io), backed by Zod schemas.
 *
 * \`traktApi()\` returns a client with precise request/response types for every
 * endpoint; the individual Zod schemas and inferred model types are also
 * exported for validation and reuse.
 *
 * @example
 * \`\`\`ts
 * import { traktApi } from '@trakt/api';
 *
 * const client = traktApi({ apiKey: '<client-id>' });
 *
 * const res = await client.movies.summary({ params: { id: 'tron-legacy-2010' } });
 * if (res.status === 200) {
 *   console.log(res.body.title); // fully typed
 * }
 * \`\`\`
 *
 * @module
 */
`;
const indexDts = join(typesDir, 'index.d.ts');
await Deno.writeTextFile(
  indexDts,
  moduleDoc + await Deno.readTextFile(indexDts),
);

console.log(`Wrote ${count} declaration files to ./types`);
