// Genera los PNG de la marca a partir de public/marca/gv-logo.svg:
//   gv-logo-512.png (icono) y galivelop-social.png (1200x630, la portada social del portal en PNG; README.md).
// Uso: npm i --no-save playwright && node tools/generar-marca.mjs
// (Chromium de Playwright; otra ruta con CHROMIUM_PATH=...)
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require('/opt/node-tools/node_modules/playwright')); // sesiones en la nube
}

const svg = readFileSync('public/marca/gv-logo.svg', 'utf8');
const dataSvg = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

try {
  const icono = await navegador.newPage({ viewport: { width: 512, height: 512 } });
  await icono.setContent(`<body style="margin:0;background:transparent"><img src="${dataSvg}" width="512" height="512"></body>`);
  await icono.screenshot({ path: 'public/marca/gv-logo-512.png', omitBackground: true });

  // La imagen social del README es la portada del portal (tools/og/portal.html) exportada a PNG: una sola composición.
  const social = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
  await social.goto(`file://${resolve('tools/og/portal.html')}`);
  await social.evaluate(() => document.fonts.ready);
  await social.screenshot({ path: 'public/marca/galivelop-social.png' });
} finally {
  await navegador.close();
}
