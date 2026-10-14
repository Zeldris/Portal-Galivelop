// Tras `vite build`: crea una página HTML real por ruta e idioma (castellano sin prefijo, /gl/, /en/) (sin el 404 de GitHub Pages), con su título,
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

const IDIOMAS = ['es', 'gl', 'en'];
const prefijo = (i) => (i === 'es' ? '' : `${i}/`);
const urlDe = (i, ruta) => `${SITIO}/${prefijo(i)}${ruta ? ruta + '/' : ''}`;
const FIJAS = {
  '': {
    es: ['Galivelop · Taller independiente de software', 'Galivelop: un taller donde creamos, investigamos, innovamos y aprendemos. Proyectos expuestos tal y como están y abiertos a quien quiera participar.'],
    gl: ['Galivelop · Obradoiro independente de software', 'Galivelop: un obradoiro onde creamos, investigamos, innovamos e aprendemos. Proxectos expostos tal e como están e abertos a quen queira participar.'],
    en: ['Galivelop · Independent software workshop', 'Galivelop: a workshop where we create, research, innovate and learn. Projects shown as they are and open to anyone who wants to take part.'],
  },
  equipo: { es: ['Equipo · Galivelop'], gl: ['Equipo · Galivelop'], en: ['Team · Galivelop'] },
  'participa/proponer': { es: ['Propón un proyecto · Galivelop'], gl: ['Propón un proxecto · Galivelop'], en: ['Propose a project · Galivelop'] },
  'participa/unirse': { es: ['Únete al taller · Galivelop'], gl: ['Únete ao obradoiro · Galivelop'], en: ['Join the workshop · Galivelop'] },
};

const paginas = [];
for (const idioma of IDIOMAS) {
  for (const [ruta, t] of Object.entries(FIJAS)) {
    paginas.push({ idioma, ruta, titulo: t[idioma][0], descripcion: t[idioma][1] ?? FIJAS[''][idioma][1], imagen: IMAGEN });
  }
  for (const p of proyectos) {
    paginas.push({
      idioma,
      ruta: `proyectos/${p.slug}`,
      titulo: `${p.nombre} · ${p.lema[idioma].replace(/\.$/, '')} · Galivelop`,
      descripcion: p.resumen[idioma],
      imagen: `${SITIO}/${p.portada.src}`,
      fecha: p.actualizado,
    });
  }
}

for (const pg of paginas) {
  const url = urlDe(pg.idioma, pg.ruta);
  const alternas = [
    ...IDIOMAS.map((i) => `<link rel="alternate" hreflang="${i}" href="${urlDe(i, pg.ruta)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${urlDe('es', pg.ruta)}" />`,
  ].join('\n    ');
  let html = base
    .replace(/<html lang="[^"]*"/, `<html lang="${pg.idioma}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(pg.titulo)}</title>\n    <link rel="canonical" href="${url}" />\n    ${alternas}`)
    .replace(/(property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(property="og:title" content=")[^"]*/, `$1${esc(pg.titulo)}`)
    .replace(/(name="twitter:title" content=")[^"]*/, `$1${esc(pg.titulo)}`);
  for (const k of ['name="description"', 'property="og:description"', 'name="twitter:description"']) {
    html = html.replace(new RegExp(`(${k} content=")[^"]*`), `$1${esc(pg.descripcion)}`);
  }
  if (pg.imagen !== IMAGEN) {
    html = html
      .replace(/(property="og:image" content=")[^"]*/, `$1${pg.imagen}`)
      .replace(/(name="twitter:image" content=")[^"]*/, `$1${pg.imagen}`)
      .replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, '');
  }
  const dir = `dist/${prefijo(pg.idioma)}${pg.ruta}`.replace(/\/$/, '');
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, html);
}

const hoy = new Date().toISOString().slice(0, 10);
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paginas
    .map((pg) => `  <url><loc>${urlDe(pg.idioma, pg.ruta)}</loc><lastmod>${pg.fecha ?? hoy}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITIO}/sitemap.xml\n`);
console.log(`Páginas estáticas: ${paginas.length}, sitemap.xml y robots.txt`);
