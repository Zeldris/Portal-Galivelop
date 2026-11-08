// Saca los webp de los diagramas del flujo (docs/diagramas/*.svg) con las fuentes de la marca (docs/marca.md).
// Uso: node scripts/diagramas-webp.mjs [arquitectura versiones …]   (sin nombres, todos; «portada» = galivelop-workflow.svg)
// Deja public/proyectos/galivelop-workflow/<n>.webp (1600 de ancho) y <n>-mini.webp (720), con PIL.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require('/opt/node-tools/node_modules/playwright')); // sesiones en la nube
}

const NOMBRES = { portada: 'galivelop-workflow', arquitectura: 'gw-arquitectura', fases: 'gw-fases', 'pre-push': 'gw-pre-push', sesion: 'gw-sesion', subagentes: 'gw-subagentes', versiones: 'gw-versiones' };
const pedidos = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(NOMBRES);
const fuentes = 'node_modules/@fontsource-variable';
const b64 = (r) => 'data:font/woff2;base64,' + readFileSync(`${fuentes}/${r}`).toString('base64');
// Las fuentes van incrustadas: setContent no carga file://.
const css = `
@font-face{font-family:'Big Shoulders Display Variable';font-weight:100 900;src:url(${b64('big-shoulders-display/files/big-shoulders-display-latin-wght-normal.woff2')}) format('woff2')}
@font-face{font-family:'Literata Variable';font-weight:200 900;src:url(${b64('literata/files/literata-latin-wght-normal.woff2')}) format('woff2')}
@font-face{font-family:'JetBrains Mono Variable';font-weight:100 800;src:url(${b64('jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2')}) format('woff2')}
@font-face{font-family:'JetBrains Mono Variable';font-weight:100 800;src:url(${b64('jetbrains-mono/files/jetbrains-mono-latin-ext-wght-normal.woff2')}) format('woff2');unicode-range:U+0100-02AF,U+2190-21FF,U+2200-22FF}
body{margin:0;background:#fbfcfd}`;

const tmp = mkdtempSync(join(tmpdir(), 'diagramas-'));
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
for (const n of pedidos) {
  if (!NOMBRES[n]) throw new Error(`Diagrama desconocido: ${n} (vale: ${Object.keys(NOMBRES).join(', ')})`);
  const svg = readFileSync(`docs/diagramas/${NOMBRES[n]}.svg`, 'utf8');
  const alto = Number(svg.match(/viewBox="0 0 1600 (\d+)"/)[1]);
  await pagina.setContent(`<!doctype html><html><head><style>${css}</style></head><body>${svg}</body></html>`);
  await pagina.evaluate(() => Promise.all(["800 40px 'Big Shoulders Display Variable'", "400 20px 'JetBrains Mono Variable'", "700 20px 'JetBrains Mono Variable'"].map((f) => document.fonts.load(f))));
  const png = join(tmp, `${n}.png`);
  await pagina.screenshot({ path: png, clip: { x: 0, y: 0, width: 1600, height: alto } });
  const salida = `public/proyectos/galivelop-workflow/${n}`;
  execFileSync('python3', ['-c', `import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB'); o=sys.argv[2]
im.save(o+'.webp',quality=82,method=6)
im.resize((720,round(im.height*720/1600)),Image.LANCZOS).save(o+'-mini.webp',quality=82,method=6)`, png, salida]);
  console.log(`${salida}.webp 1600×${alto} y -mini`);
}
await navegador.close();
rmSync(tmp, { recursive: true });
