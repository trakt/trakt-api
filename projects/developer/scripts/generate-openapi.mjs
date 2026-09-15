import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const developerRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = join(developerRoot, '..', '..');
const generated = join(repositoryRoot, 'projects', 'openapi', 'openapi.json');
const destination = join(developerRoot, 'static', 'openapi.json');

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit' });
    child.on('error', reject);
    child.on(
      'close',
      (code) =>
        code === 0 ? resolve() : reject(
          new Error(`${command} ${args.join(' ')} exited with ${code}`),
        ),
    );
  });
}

await run('deno', ['task', 'openapi:generate'], repositoryRoot);

const document = JSON.parse(await readFile(generated, 'utf8'));
await mkdir(dirname(destination), { recursive: true });
await writeFile(destination, JSON.stringify(document));

console.log(
  `Wrote ${Object.keys(document.paths).length} paths to static/openapi.json.`,
);
