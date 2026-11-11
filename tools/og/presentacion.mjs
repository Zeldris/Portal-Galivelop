// Renderiza la imagen de presentación compuesta de un proyecto (tools/og/<slug>-presentacion.html, 1200×630) a
// tools/og/fuentes/<slug>/og-fuente.png (vista previa en redes; después, `python3 tools/og/generar.py`) y a
// og-fuente-gl.png y og-fuente-en.png (?l=gl|en, la vista previa de las páginas en gallego e inglés), y a
// presentacion.webp (1600×840) + presentacion-mini.webp (720×378), la imagen del collage de la portada.
// Uso: node tools/og/presentacion.mjs galivelop-workflow
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require('/opt/node-tools/node_modules/playwright')); // sesiones en la nube
}

const slug = process.argv[2];
const html = resolve(`tools/og/${slug}-presentacion.html`);
if (!slug || !existsSync(html)) {
  console.error('Uso: node tools/og/presentacion.mjs <slug>  (necesita tools/og/<slug>-presentacion.html)');
  process.exit(1);
}
const carpeta = `public/proyectos/${slug}`;
const fuente = `tools/og/fuentes/${slug}`;
mkdirSync(fuente, { recursive: true });
const navegador = await chromium.launch();
try {
  const tomas = [[1, '', `${fuente}/og-fuente.png`], [1, '?l=gl', `${fuente}/og-fuente-gl.png`],
    [1, '?l=en', `${fuente}/og-fuente-en.png`], [4 / 3, '', `${carpeta}/presentacion.png`]];
  for (const [escala, idioma, destino] of tomas) {
    const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: escala });
    await pagina.goto(`file://${html}${idioma}`);
    await pagina.evaluate(async () => { await Promise.all([...document.fonts].map((f) => f.load())); await document.fonts.ready; }); // todas las fuentes, no solo las ya pedidas
    await pagina.screenshot({ path: destino });
    await pagina.close();
  }
} finally {
  await navegador.close();
}
execFileSync('python3', ['-c', `
from PIL import Image
from pathlib import Path
p = Path('${carpeta}/presentacion.png'); im = Image.open(p).convert('RGB')
im.save('${carpeta}/presentacion.webp', quality=82, method=6)
im.resize((720, 378), Image.LANCZOS).save('${carpeta}/presentacion-mini.webp', quality=80, method=6)
p.unlink()`], { stdio: 'inherit' });
execFileSync('python3', ['tools/og/generar.py'], { stdio: 'inherit' });
console.log(`${fuente}/og-fuente*.png, ${carpeta}: presentacion.webp, presentacion-mini.webp y og.jpg`);
