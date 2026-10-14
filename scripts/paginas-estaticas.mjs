// Tras `vite build`: crea una página HTML real por ruta (sin el 404 de GitHub Pages), con su título,
// descripción, canónica y vista previa para redes, y genera sitemap.xml y robots.txt.
// Si cambia la dirección del portal, actualizar SITIO.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const SITIO = 'https://zeldris.github.io/Portal-Galivelop';
const IMAGEN = `${SITIO}/marca/galivelop-portal.jpg`;
const base = readFileSync('dist/index.html', 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const proyectos = readdirSync('src/data/proyectos')
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(`src/data/proyectos/${f}`, 'utf8')));

const paginas = [
  { ruta: '', titulo: 'Galivelop · Taller independiente de software', imagen: IMAGEN },
  ...proyectos.map((p) => ({
    ruta: `proyectos/${p.slug}`,
    titulo: `${p.nombre} · ${p.lema.es.replace(/\.$/, "")} · Galivelop`,
    descripcion: p.resumen.es,
    imagen: `${SITIO}/${p.portada.src}`,
    fecha: p.actualizado,
  })),
  { ruta: 'equipo', titulo: 'Equipo · Galivelop', imagen: IMAGEN },
  { ruta: 'participa/proponer', titulo: 'Propón un proyecto · Galivelop', imagen: IMAGEN },
  { ruta: 'participa/unirse', titulo: 'Únete al taller · Galivelop', imagen: IMAGEN },
];

for (const pg of paginas) {
  const url = `${SITIO}/${pg.ruta ? pg.ruta + '/' : ''}`;
  let html = base
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(pg.titulo)}</title>\n    <link rel="canonical" href="${url}" />`)
    .replace(/(property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(property="og:title" content=")[^"]*/, `$1${esc(pg.titulo)}`)
    .replace(/(name="twitter:title" content=")[^"]*/, `$1${esc(pg.titulo)}`);
  if (pg.descripcion) {
    for (const k of ['name="description"', 'property="og:description"', 'name="twitter:description"']) {
      html = html.replace(new RegExp(`(${k} content=")[^"]*`), `$1${esc(pg.descripcion)}`);
    }
  }
  if (pg.imagen !== IMAGEN) {
    html = html
      .replace(/(property="og:image" content=")[^"]*/, `$1${pg.imagen}`)
      .replace(/(name="twitter:image" content=")[^"]*/, `$1${pg.imagen}`)
      .replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, '');
  }
  if (pg.ruta) {
    mkdirSync(`dist/${pg.ruta}`, { recursive: true });
    writeFileSync(`dist/${pg.ruta}/index.html`, html);
  } else {
    writeFileSync('dist/index.html', html);
  }
}

const hoy = new Date().toISOString().slice(0, 10);
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paginas
    .map((pg) => `  <url><loc>${SITIO}/${pg.ruta ? pg.ruta + '/' : ''}</loc><lastmod>${pg.fecha ?? hoy}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITIO}/sitemap.xml\n`);
console.log(`Páginas estáticas: ${paginas.length}, sitemap.xml y robots.txt`);
