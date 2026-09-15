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

const LOGOMARK =
  `<svg class="mark" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="tg" cx="48.46" cy="-.95" fx="48.46" fy="-.95" r="64.84" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#9f42c6"/><stop offset=".27" stop-color="#a041c3"/>
      <stop offset=".42" stop-color="#a43ebb"/><stop offset=".53" stop-color="#aa39ad"/>
      <stop offset=".64" stop-color="#b4339a"/><stop offset=".73" stop-color="#c02b81"/>
      <stop offset=".82" stop-color="#cf2061"/><stop offset=".9" stop-color="#e1143c"/>
      <stop offset=".97" stop-color="#f50613"/><stop offset="1" stop-color="red"/>
    </radialGradient>
  </defs>
  <path fill="url(#tg)" d="M48,11.26v25.47c0,6.22-5.05,11.27-11.27,11.27H11.26c-6.22,0-11.26-5.05-11.26-11.27V11.26C0,5.04,5.04,0,11.26,0h25.47c3.32,0,6.3,1.43,8.37,3.72.47.52.89,1.08,1.25,1.68.18.29.34.59.5.89.33.68.6,1.39.79,2.14.1.37.18.76.23,1.15.09.54.13,1.11.13,1.68Z"/>
  <g fill="#fff"><path d="M13.62,17.97l7.92,7.92,1.47-1.47-7.92-7.92-1.47,1.47ZM28.01,32.37l1.47-1.46-2.16-2.16,20.32-20.32c-.19-.75-.46-1.46-.79-2.14l-22.46,22.46,3.62,3.62ZM12.92,18.67l-1.46,1.46,14.4,14.4,1.46-1.47-4.32-4.31L46.35,5.4c-.36-.6-.78-1.16-1.25-1.68l-23.56,23.56-8.62-8.61ZM47.87,9.58l-19.17,19.17,1.47,1.46,17.83-17.83v-1.12c0-.57-.04-1.14-.13-1.68ZM25.16,22.27l-7.92-7.92-1.47,1.47,7.92,7.92,1.47-1.47ZM41.32,35.12c0,3.42-2.78,6.2-6.2,6.2H12.88c-3.42,0-6.2-2.78-6.2-6.2V12.88c0-3.42,2.78-6.21,6.2-6.21h20.78v-2.07H12.88c-4.56,0-8.28,3.71-8.28,8.28v22.24c0,4.56,3.71,8.28,8.28,8.28h22.24c4.56,0,8.28-3.71,8.28-8.28v-3.51h-2.07v3.51Z"/></g>
</svg>`;

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
