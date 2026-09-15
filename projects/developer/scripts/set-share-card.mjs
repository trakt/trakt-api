import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, '..', 'build');
const CARDS = join(BUILD, 'og');
const ORIGIN = 'https://developer.trakt.tv';

// app.html ships a real card URL rather than a token: the prerenderer follows
// og:image, and a token 404s the build. It also means a page still carries a
// valid card if this script never runs.
const CARD_URL =
  /https:\/\/developer\.trakt\.tv\/og\/[a-z0-9-]+\.png(?:\?v=[a-z0-9]+)?/g;

function revision() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;

  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' })
      .trim();
  } catch {
    return 'unknown';
  }
}

function pick(cards, sha) {
  const digest = createHash('sha256').update(sha).digest();
  return cards[digest.readUInt32BE(0) % cards.length];
}

const cards = (await readdir(CARDS))
  .filter((name) => name.endsWith('.png'))
  .sort();

if (cards.length === 0) throw new Error('No share cards found in build/og.');

// Unfurlers cache by image URL. The filename alone only has as many values as
// there are cards, so it repeats cache keys once every card has been used; the
// revision query is what actually makes each deploy a new key.
const sha = revision();
const chosen = pick(cards, sha);
const url = `${ORIGIN}/og/${chosen}?v=${sha.slice(0, 12)}`;

const pages = (await readdir(BUILD)).filter((name) => name.endsWith('.html'));
let replacements = 0;

for (const page of pages) {
  const path = join(BUILD, page);
  const html = await readFile(path, 'utf8');

  // Count matches rather than diffing the result: when the pick equals the
  // URL app.html already ships, a correct rewrite produces an identical file.
  if (!html.match(CARD_URL)) continue;

  await writeFile(path, html.replace(CARD_URL, url));
  replacements += 1;
}

if (replacements === 0) {
  throw new Error('No built page contained a share card URL to replace.');
}

console.log(
  `Share card for this build: ${chosen}?v=${
    sha.slice(0, 12)
  } (${replacements} page${replacements === 1 ? '' : 's'})`,
);
