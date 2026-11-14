// Renderiza la vista previa en redes de un proyecto en gallego e inglés (tools/og/<slug>-og.html?l=gl|en, 1200×630) a
// tools/og/fuentes/<slug>/og-fuente-<gl|en>.png y regenera los og*.jpg con tools/og/generar.py. Para los proyectos cuya
// og-fuente.png (en castellano) es una imagen hecha a mano con el texto dentro; la del workflow sale de
// tools/og/presentacion.mjs y la del portal, de tools/og/portal.mjs. Con --es, la plantilla pinta también la de
// castellano (og-fuente.png): para las que se montan sobre una placa del generador (recurso 24).
// Uso: node tools/og/traducir.mjs tarkor --es
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
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
const html = resolve(`tools/og/${slug}-og.html`);
if (!slug || !existsSync(html)) {
  console.error('Uso: node tools/og/traducir.mjs <slug> [--es]  (necesita tools/og/<slug>-og.html)');
  process.exit(1);
}
const conCastellano = process.argv.includes('--es');
const navegador = await chromium.launch();
try {
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
  for (const idioma of conCastellano ? ['es', 'gl', 'en'] : ['gl', 'en']) {
    await pagina.goto(`file://${html}?l=${idioma}`);
    await pagina.evaluate(async () => { await Promise.all([...document.fonts].map((f) => f.load())); await document.fonts.ready; }); // todas las fuentes, no solo las ya pedidas
    const nombre = idioma === 'es' ? 'og-fuente.png' : `og-fuente-${idioma}.png`;
    await pagina.screenshot({ path: `tools/og/fuentes/${slug}/${nombre}` });
  }
} finally {
  await navegador.close();
}
execFileSync('python3', ['tools/og/generar.py'], { stdio: 'inherit' });
console.log(`tools/og/fuentes/${slug}/: og-fuente${conCastellano ? '.png, og-fuente' : ''}-gl.png y og-fuente-en.png`);
