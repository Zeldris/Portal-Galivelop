// Renderiza la portada social del portal (tools/og/portal.html, 1200×630) a public/marca/galivelop-portal.jpg, la
// og:image de la portada; scripts/paginas-estaticas.mjs le añade ?v=<hash>, así que las redes la refrescan sola.
// Uso: node tools/og/portal.mjs
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require('/opt/node-tools/node_modules/playwright')); // sesiones en la nube
}

const html = resolve('tools/og/portal.html');
const png = 'public/marca/galivelop-portal.png';
const navegador = await chromium.launch();
try {
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
  await pagina.goto(`file://${html}`);
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.screenshot({ path: png });
} finally {
  await navegador.close();
}
execFileSync('python3', ['-c', `
from PIL import Image
from pathlib import Path
p = Path('${png}'); Image.open(p).convert('RGB').save('public/marca/galivelop-portal.jpg', quality=88, optimize=True)
p.unlink()`], { stdio: 'inherit' });
console.log('public/marca/galivelop-portal.jpg');
