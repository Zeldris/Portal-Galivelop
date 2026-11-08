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
// Ningún subconjunto de Fontsource trae las flechas y marcas (→ ≤ ✓ ✗): sin esto las pondría la fuente del sistema
// de cada máquina y el webp cambiaría según dónde se genere. docs/diagramas/simbolos.woff2 es un subconjunto de
// DejaVu Sans Mono (licencia libre de DejaVu/Bitstream Vera) con solo esos signos (U+2190-2193, 2264-2265, 2713, 2717):
// pyftsubset DejaVuSansMono.ttf --unicodes="U+2190-2193,U+2264,U+2265,U+2713,U+2717" --flavor=woff2
// Declarado con el mismo nombre de familia y después de la fuente, el navegador lo usa solo para esos puntos de código.
const SIMBOLOS = 'U+2190-2193,U+2264-2265,U+2713,U+2717';
const simbolos = (familia) =>
  `@font-face{font-family:'${familia}';font-weight:100 900;src:url(data:font/woff2;base64,${readFileSync('docs/diagramas/simbolos.woff2').toString('base64')}) format('woff2');unicode-range:${SIMBOLOS}}`;
// Las fuentes van incrustadas: setContent no carga file://.
const css = `
@font-face{font-family:'Big Shoulders Display Variable';font-weight:100 900;src:url(${b64('big-shoulders-display/files/big-shoulders-display-latin-wght-normal.woff2')}) format('woff2')}
@font-face{font-family:'Literata Variable';font-weight:200 900;src:url(${b64('literata/files/literata-latin-wght-normal.woff2')}) format('woff2')}
@font-face{font-family:'JetBrains Mono Variable';font-weight:100 800;src:url(${b64('jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2')}) format('woff2')}
${simbolos('JetBrains Mono Variable')}
${simbolos('Big Shoulders Display Variable')}
${simbolos('Literata Variable')}
body{margin:0;background:#fbfcfd}`;

const desconocidos = pedidos.filter((n) => !NOMBRES[n]);
if (desconocidos.length) {
  console.error(`Diagrama desconocido: ${desconocidos.join(', ')} (vale: ${Object.keys(NOMBRES).join(', ')})`);
  process.exit(1);
}
const tmp = mkdtempSync(join(tmpdir(), 'diagramas-'));
const navegador = await chromium.launch();
try {
for (const n of pedidos) {
  const svg = readFileSync(`docs/diagramas/${NOMBRES[n]}.svg`, 'utf8');
  const caja = svg.match(/viewBox="0 0 1600 (\d+)"/);
  if (!caja) throw new Error(`${NOMBRES[n]}.svg: hace falta viewBox="0 0 1600 <alto>"`);
  const alto = Number(caja[1]);
  const pagina = await navegador.newPage({ viewport: { width: 1600, height: alto }, deviceScaleFactor: 1 });
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
  await pagina.close();
  console.log(`${salida}.webp 1600×${alto} y -mini`);
}
} finally {
  await navegador.close();
  rmSync(tmp, { recursive: true });
}
// La portada es el origen de og.jpg (src/data/og.test.ts comprueba su huella): se regenera con ella.
if (pedidos.includes('portada')) execFileSync('python3', ['tools/og/generar.py'], { stdio: 'inherit' });
