// Tras `vite build`: crea una página HTML real por ruta e idioma (castellano sin prefijo, /gl/, /en/) (sin el 404 de GitHub Pages), con su título,
// descripción, canónica y vista previa para redes, y genera sitemap.xml y robots.txt.
// Si cambia la dirección del portal, actualizar SITIO.
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const SITIO = 'https://zeldris.github.io/Portal-Galivelop';
// ?v= es el hash de la imagen: las redes (Discord, X…) guardan la vista previa por su dirección.
const imagenDe = (src) => `${SITIO}/${src}?v=${createHash('sha1').update(readFileSync(`public/${src}`)).digest('hex').slice(0, 8)}`;
const IMAGEN = imagenDe('marca/galivelop-portal.jpg');
const conImagen = (html, url) => html
  .replace(/(property="og:image" content=")[^"]*/, `$1${url}`)
  .replace(/(name="twitter:image" content=")[^"]*/, `$1${url}`);
const base = readFileSync('dist/index.html', 'utf8');
// El 404 es copia de la portada sin páginas estáticas: solo necesita la imagen versionada.
writeFileSync('dist/404.html', conImagen(readFileSync('dist/404.html', 'utf8'), IMAGEN));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// En el mismo orden que src/data/proyectos.ts: el último añadido (mayor `orden`), el primero.
const proyectos = readdirSync('src/data/proyectos')
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(`src/data/proyectos/${f}`, 'utf8')))
  .sort((a, b) => b.orden - a.orden);

// Publicaciones del muro (src/data/muro/<proyecto>/<pieza>.json), la más reciente primero, como src/data/muro.ts.
const publicaciones = readdirSync('src/data/muro', { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) => readdirSync(`src/data/muro/${d.name}`).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(`src/data/muro/${d.name}/${f}`, 'utf8'))))
  .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.pieza.localeCompare(a.pieza));

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
// El muro solo tiene página (y entra en el sitemap) cuando ya hay alguna publicación.
if (publicaciones.length > 0) {
  FIJAS.muro = {
    es: ['Muro · Galivelop', 'Lo que cuenta cada proyecto de Galivelop mientras avanza: pruebas, decisiones, imágenes y lo aprendido.'],
    gl: ['Muro · Galivelop', 'O que conta cada proxecto de Galivelop mentres avanza: probas, decisións, imaxes e o aprendido.'],
    en: ['Feed · Galivelop', 'What each Galivelop project shares as it moves forward: tests, decisions, images and lessons learnt.'],
  };
}

const paginas = [];
for (const idioma of IDIOMAS) {
  for (const [ruta, t] of Object.entries(FIJAS)) {
    paginas.push({ idioma, ruta, titulo: t[idioma][0], descripcion: t[idioma][1] ?? FIJAS[''][idioma][1], imagen: IMAGEN, ...(ruta === 'muro' ? { fecha: publicaciones[0].fecha } : {}) });
  }
  for (const p of proyectos) {
    p.imagen ??= imagenDe(p.portada.src);
    paginas.push({
      idioma,
      ruta: `proyectos/${p.slug}`,
      titulo: `${p.nombre} · ${p.lema[idioma].replace(/\.$/, '')} · Galivelop`,
      descripcion: p.resumen[idioma],
      imagen: p.imagen,
      fecha: p.actualizado,
      proyecto: p,
    });
  }
}

const ORG = { '@type': 'Organization', name: 'Galivelop', url: `${SITIO}/`, logo: `${SITIO}/marca/gv-logo-512.png`, email: 'alvarogarciagrana@gmail.com', sameAs: ['https://discord.gg/8vyjW3VrN', 'https://github.com/Zeldris'] };
const TIPO = { tarkor: 'VideoGame', toveriai: 'WebApplication', 'galivelop-workflow': 'SoftwareApplication' };

/** Texto de la página en HTML simple (lo sustituye React al cargar; lo leen buscadores sin JS). */
function cuerpo(pg) {
  const enlaces = proyectos.map((p) => `<li><a href="${urlDe(pg.idioma, `proyectos/${p.slug}`)}">${esc(p.nombre)}</a>: ${esc(p.lema[pg.idioma])}</li>`).join('');
  const p = pg.proyecto;
  if (pg.ruta === 'muro') {
    const nombre = (slug) => proyectos.find((x) => x.slug === slug)?.nombre ?? slug;
    const posts = publicaciones.map((x) => `<article><h2>${esc(x.titulo[pg.idioma])}</h2><p>${esc(nombre(x.proyecto))} · ${x.fecha}</p><p>${esc(x.texto[pg.idioma])}</p>${(x.cuerpo ?? []).map((c) => `<p>${esc(c[pg.idioma])}</p>`).join('')}</article>`).join('');
    return `<main><h1>${esc(pg.titulo)}</h1><p>${esc(pg.descripcion)}</p>${posts}<ul>${enlaces}</ul></main>`;
  }
  if (!p) return `<main><h1>${esc(pg.titulo)}</h1><p>${esc(pg.descripcion)}</p><ul>${enlaces}</ul></main>`;
  const ext = p.enlaces.map((e) => `<li><a href="${e.url}">${esc(e.etiqueta[pg.idioma])}</a></li>`).join('');
  return `<main><h1>${esc(p.nombre)}</h1><p>${esc(p.lema[pg.idioma])}</p><p>${esc(p.resumen[pg.idioma])}</p>${p.descripcion.map((d) => `<p>${esc(d[pg.idioma])}</p>`).join('')}<ul>${p.caracteristicas.map((c) => `<li><strong>${esc(c.titulo[pg.idioma])}</strong>: ${esc(c.texto[pg.idioma])}</li>`).join('')}</ul>${ext ? `<ul>${ext}</ul>` : ''}<p><a href="${urlDe(pg.idioma, '')}">Galivelop</a></p><ul>${enlaces}</ul></main>`;
}

function datos(pg, url) {
  const p = pg.proyecto;
  if (!p) return { '@context': 'https://schema.org', '@graph': [ORG, { '@type': 'WebSite', name: 'Galivelop', url: urlDe(pg.idioma, ''), inLanguage: pg.idioma, publisher: { '@type': 'Organization', name: 'Galivelop' } }] };
  return {
    '@context': 'https://schema.org',
    '@type': TIPO[p.slug] ?? 'CreativeWork',
    name: p.nombre,
    description: p.resumen[pg.idioma],
    url,
    image: pg.imagen,
    inLanguage: pg.idioma,
    dateModified: p.actualizado,
    keywords: p.etiquetas.join(', '),
    ...(TIPO[p.slug] === 'WebApplication' ? { applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web' } : {}),
    ...(TIPO[p.slug] === 'VideoGame' ? { genre: 'RPG', gamePlatform: ['Windows', 'Linux', 'Steam Deck'] } : {}),
    ...(TIPO[p.slug] === 'SoftwareApplication' ? { applicationCategory: 'DeveloperApplication', operatingSystem: ['Linux', 'macOS'] } : {}),
    ...(p.enlaces[0] ? { sameAs: p.enlaces.map((e) => e.url) } : {}),
    creator: ORG,
  };
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
  html = conImagen(html, pg.imagen);
  if (pg.proyecto) {
    const alt = esc(pg.proyecto.portada.alt[pg.idioma]);
    html = html
      .replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, '')
      .replace(/(property="og:image:alt" content=")[^"]*/, `$1${alt}`)
      .replace(/(name="twitter:image:alt" content=")[^"]*/, `$1${alt}`);
  }
  html = html
    .replace('</head>', `  <script type="application/ld+json">${JSON.stringify(datos(pg, url)).replace(/</g, '\\u003c')}</script>\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${cuerpo(pg)}</div>`);
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
writeFileSync(
  'dist/llms.txt',
  `# Galivelop\n\n> ${FIJAS[''].es[1]}\n\n## Proyectos\n\n${proyectos
    .map((p) => `- [${p.nombre}](${urlDe('es', `proyectos/${p.slug}`)}): ${p.resumen.es}`)
    .join('\n')}\n\n## Más\n\n${publicaciones.length > 0 ? `- [Muro](${urlDe('es', 'muro')}): publicaciones de los proyectos\n` : ''}- [Equipo](${urlDe('es', 'equipo')})\n- [Únete al taller](${urlDe('es', 'participa/unirse')})\n- [Propón un proyecto](${urlDe('es', 'participa/proponer')})\n- Versiones: [galego](${urlDe('gl', '')}), [English](${urlDe('en', '')})\n`,
);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITIO}/sitemap.xml\n`);
console.log(`Páginas estáticas: ${paginas.length}, sitemap.xml, robots.txt y llms.txt`);
