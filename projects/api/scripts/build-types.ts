/**
 * Generates static `.d.ts` declarations for the public API into `./types`.
 *
 * The contracts are built on Zod + ts-rest, whose fully-inferred types are
 * "slow types" for JSR (and force every consumer to re-derive them on each
 * type-check). This precomputes explicit declarations once, so `mod.js` can
 * expose them via `@ts-self-types` and consumers get fast, static types.
 *
 * Runs tsc for declaration emit, then copies the declarations into `./types`
 * and rewrites relative `.js`/`.ts` import specifiers to `.d.ts` so the types
 * resolve in a declaration-only tree.
 */
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const root = dirname(import.meta.dir);
const tmp = await mkdtemp(join(tmpdir(), 'trakt-api-dts-'));
const typesDir = join(root, 'types');

console.log('Emitting declarations via tsc...');
const tsc = Bun.spawnSync(
  [
    process.execPath,
    Bun.resolveSync('typescript/bin/tsc', root),
    '-p',
    join(root, 'tsconfig.build.json'),
    '--outDir',
    tmp,
  ],
  { stdout: 'inherit', stderr: 'inherit' },
);
if (tsc.exitCode !== 0) {
  await rm(tmp, { recursive: true, force: true });
  process.exit(tsc.exitCode);
}

await rm(typesDir, { recursive: true, force: true });

// Rewrite relative `.js`/`.ts` specifiers to `.d.ts` (in both `from '...'`
// and inline `import("...")`), so declarations resolve in a types-only tree.
const rewrite = (src: string): string =>
  src.replace(
    /(['"])(\.[^'"]*?)\.(?:js|ts)\1/g,
    (_m, quote, path) => `${quote}${path}.d.ts${quote}`,
  );

const declarations = (await readdir(tmp, { recursive: true })).filter((path) =>
  path.endsWith('.d.ts'),
);
await Promise.all(
  declarations.map(async (path) => {
    const dest = join(typesDir, path);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, rewrite(await readFile(join(tmp, path), 'utf8')));
  }),
);
await rm(tmp, { recursive: true });

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
await writeFile(indexDts, moduleDoc + (await readFile(indexDts, 'utf8')));

console.log(`Wrote ${declarations.length} declaration files to ./types`);
