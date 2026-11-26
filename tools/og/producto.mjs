// Renderiza la vista previa en redes de la página de cada producto (tools/og/producto.html, 1200×630) a
// public/productos/<slug>/og.jpg, og-gl.jpg y og-en.jpg, desde src/data/productos/<slug>.json (nombre, alias, lema,
// acento, estado y portada o primera figura). scripts/paginas-estaticas.mjs la usa si existe y le añade ?v=<hash>.
// Se vuelve a correr al cambiar el lema, el estado, la portada o la figura del producto.
// Uso: node tools/og/producto.mjs [slug…]   (sin slug, todos los productos con página)
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require('/opt/node-tools/node_modules/playwright')); // sesiones en la nube
}

const IDIOMAS = ['es', 'gl', 'en'];
const leer = (slug) => JSON.parse(readFileSync(`src/data/productos/${slug}.json`, 'utf8'));
const pedidos = process.argv.slice(2);
const slugs = pedidos.length
  ? pedidos
  : readdirSync('src/data/productos').filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).filter((s) => leer(s).pagina);
const publico = (src) => `file://${resolve('public', src.replace(/^\//, ''))}`;

const html = resolve('tools/og/producto.html');
const navegador = await chromium.launch();
try {
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
  for (const slug of slugs) {
    const x = leer(slug);
    if (!x.pagina) throw new Error(`${slug}: el producto no tiene página`);
    const figura = x.pagina.figuras?.[0];
    mkdirSync(`public/productos/${slug}`, { recursive: true });
    for (const l of IDIOMAS) {
      await pagina.goto(`file://${html}`);
      await pagina.evaluate(
        (d) => window.pintar(d),
        {
          l,
          nombre: x.nombre,
          alias: x.alias,
          frases: x.pagina.lema.map((t) => t[l]),
          acento: x.acento,
          estado: x.estado,
          fondo: x.pagina.portada ? publico(x.pagina.portada.src) : undefined,
          figura: !x.pagina.portada && figura ? publico(figura.srcOscuro ?? figura.src) : undefined,
        },
      );
      await pagina.evaluate(async () => {
        await Promise.all([...document.fonts].map((f) => f.load())); // todas las fuentes, no solo las ya pedidas
        await document.fonts.ready;
        await Promise.all([...document.images].map((i) => i.decode()));
      });
      const png = `public/productos/${slug}/og${l === 'es' ? '' : `-${l}`}.png`;
      if (existsSync(png)) throw new Error(`${png} ya existe: no se pisa`);
      await pagina.screenshot({ path: png });
      execFileSync('python3', ['-c', `
from PIL import Image
from pathlib import Path
p = Path('${png}'); Image.open(p).convert('RGB').save(p.with_suffix('.jpg'), quality=86, optimize=True)
p.unlink()`], { stdio: 'inherit' });
      console.log(png.replace(/\.png$/, '.jpg'));
    }
  }
} finally {
  await navegador.close();
}
