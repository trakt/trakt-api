import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadEnv } from 'vite';

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const names = [
  'TRAKT_CLIENT_ID',
  'TRAKT_CLIENT_SECRET',
  'DEVELOPER_SESSION_SECRET',
];
const secrets = names.flatMap((name) => env[name] ? [env[name]] : []);
async function check(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await check(path);
      continue;
    }
    const content = await readFile(path, 'utf8');
    if (
      names.some((name) => content.includes(name)) ||
      secrets.some((secret) =>
        content.includes(secret) || content.includes(encodeURIComponent(secret))
      )
    ) {
      throw new Error('Credential material found in browser output: ' + path);
    }
  }
}
await check('.svelte-kit/output/client');
console.log(
  'Browser output contains no private credential bindings or configured secret values.',
);
