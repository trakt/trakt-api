import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'static', 'og');
const WORK = join(HERE, '..', '.share-cards');
const CHROME = process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Measured at 50 dB PSNR against the raw capture, so visually lossless for
// flat UI art. Raise it if a variant ever bands.
const PALETTE_COLOURS = 64;

const VARIANTS = [
  { slug: 'movies-trending', method: 'GET', path: '/movies/trending' },
  { slug: 'shows-trending', method: 'GET', path: '/shows/trending' },
  { slug: 'movies-anticipated', method: 'GET', path: '/movies/anticipated' },
  { slug: 'scrobble-start', method: 'POST', path: '/scrobble/start' },
  { slug: 'shows-anticipated', method: 'GET', path: '/shows/anticipated' },
];

const LOGOMARK = `<img class="mark" alt="" src="data:image/svg+xml;base64,${
  Buffer.from(await readFile(join(HERE, '..', 'static', 'trakt-logomark.svg')))
    .toString('base64')
}" />`;

const page = ({ method, path }) =>
  `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700;800&family=JetBrains+Mono:wght@700&display=block">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:1200px;height:630px;overflow:hidden}
  body{
    background:#0b0b0d;color:#f5f5f7;
    font-family:Inter,sans-serif;font-synthesis:none;
    -webkit-font-smoothing:antialiased;
    display:flex;flex-direction:column;justify-content:center;
    padding:0 84px;gap:30px;position:relative;
  }
  .brand{position:absolute;top:56px;left:84px;display:flex;align-items:center;gap:14px}
  .mark{width:38px;height:38px}
  .brand-name{font-size:22px;font-weight:600;color:#9696a3;letter-spacing:-0.01em}
  .line{font-family:"JetBrains Mono",monospace;font-size:64px;font-weight:700;letter-spacing:-0.03em;line-height:1.1;white-space:nowrap}
  .line .m{color:${
    method === 'GET'
      ? '#65d28b'
      : method === 'POST'
      ? '#78a9ff'
      : method === 'PUT'
      ? '#ffbd5b'
      : '#ff6b72'
  }}
  .rule{width:100%;height:4px;border-radius:2px;background:linear-gradient(90deg,#9f42c6,#c02b81 42%,#f50613 78%,transparent)}
  .methods{display:flex;align-items:center;gap:12px}
  .pill{padding:8px 16px;border-radius:8px;font-family:"JetBrains Mono",monospace;font-size:18px;font-weight:700;letter-spacing:0.04em}
  .get{color:#65d28b;background:rgba(101,210,139,.14)}
  .post{color:#78a9ff;background:rgba(120,169,255,.14)}
  .put{color:#ffbd5b;background:rgba(255,189,91,.14)}
  .del{color:#ff6b72;background:rgba(255,107,114,.14)}
  .count{font-size:25px;color:#9696a3;margin-left:10px}
  .url{position:absolute;right:84px;bottom:54px;font-family:"JetBrains Mono",monospace;font-size:21px;color:#686875}
</style></head>
<body>
  <div class="brand">${LOGOMARK}<span class="brand-name">Trakt Developer</span></div>
  <div class="line"><span class="m">${method}</span> ${path}</div>
  <div class="rule"></div>
  <div class="methods">
    <span class="pill get">GET</span><span class="pill post">POST</span>
    <span class="pill put">PUT</span><span class="pill del">DELETE</span>
    <span class="count">Every endpoint, runnable in the browser.</span>
  </div>
  <div class="url">developer.trakt.tv</div>
</body></html>`;

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'ignore' });
    child.on(
      'error',
      () => reject(new Error(`${cmd} is not installed or not on PATH.`)),
    );
    child.on(
      'close',
      (code) => code === 0 ? resolve() : reject(new Error(`exit ${code}`)),
    );
  });
}

async function optimise(png) {
  await run('pngquant', [
    '--force',
    '--speed',
    '1',
    '--strip',
    String(PALETTE_COLOURS),
    '--output',
    png,
    png,
  ]);
  await run('oxipng', ['-o', '6', '--strip', 'safe', '--quiet', png]);
}

await mkdir(OUT, { recursive: true });
await mkdir(WORK, { recursive: true });

for (const v of VARIANTS) {
  const html = join(WORK, `${v.slug}.html`);
  const png = join(OUT, `${v.slug}.png`);
  await writeFile(html, page(v));
  await run(CHROME, [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    '--virtual-time-budget=8000',
    `--screenshot=${png}`,
    `file://${html}`,
  ]);
  const raw = (await readFile(png)).length;
  await optimise(png);
  const bytes = (await readFile(png)).length;
  console.log(
    `${v.slug.padEnd(20)} ${v.method} ${v.path}`.padEnd(52) +
      `${(raw / 1024).toFixed(1)} KB -> ${(bytes / 1024).toFixed(1)} KB`,
  );
}

await rm(WORK, { recursive: true, force: true });
console.log(`\n${VARIANTS.length} cards written`);
