// Tras `vite build`: crea una página HTML real por ruta e idioma (castellano sin prefijo, /gl/, /en/) (sin el 404 de GitHub Pages), con su título,
// descripción, canónica y vista previa para redes, y genera sitemap.xml, robots.txt, llms.txt y la clave de IndexNow.
// La dirección del portal está en scripts/sitio.mjs.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { INDEXNOW_CLAVE, SITIO } from './sitio.mjs';

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

// Fecha (AAAA-MM-DD) del último commit que tocó esos archivos: el lastmod de las páginas sin fecha propia en los datos.
// Google ignora un lastmod que no es fiable, así que sin historia completa de git (un clon superficial daría la fecha
// del último commit a todo) se omite en vez de poner la del build.
const gitCompleto = (() => {
  try {
    return execFileSync('git', ['rev-parse', '--is-shallow-repository'], { encoding: 'utf8' }).trim() === 'false';
  } catch {
    return false;
  }
})();
const fechaGit = (...rutas) =>
  gitCompleto ? execFileSync('git', ['log', '-1', '--format=%cs', '--', ...rutas], { encoding: 'utf8' }).trim() || undefined : undefined;
const masReciente = (...fechas) => fechas.filter(Boolean).sort().at(-1);

// Textos legales (src/data/legal/): su página estática lleva el texto entero, también sin JS.
const legales = readdirSync('src/data/legal')
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(`src/data/legal/${f}`, 'utf8')));

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

// Productos de la marca (src/data/productos/<slug>.json), en el mismo orden que src/data/productos.ts.
const productos = readdirSync('src/data/productos')
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(`src/data/productos/${f}`, 'utf8')))
  .sort((a, b) => a.orden - b.orden);
const PROXIMAMENTE = { es: 'Próximamente', gl: 'Proximamente', en: 'Coming soon' };

// En el mismo orden que src/data/equipo.ts.
const equipo = JSON.parse(readFileSync('src/data/equipo.json', 'utf8')).sort((a, b) => a.orden - b.orden);

const IDIOMAS = ['es', 'gl', 'en'];
const prefijo = (i) => (i === 'es' ? '' : `${i}/`);
const urlDe = (i, ruta) => `${SITIO}/${prefijo(i)}${ruta ? ruta + '/' : ''}`;
const FIJAS = {
  '': {
    es: ['Galivelop · Marca de software: taller y Productos', 'Galivelop son dos cosas: el taller, que crea, investiga y aprende a la vista y con la puerta abierta, y Productos, el software de descarga local y los servicios de sus integrantes.'],
    gl: ['Galivelop · Marca de software: obradoiro e Produtos', 'Galivelop son dúas cousas: o obradoiro, que crea, investiga e aprende á vista e coa porta aberta, e Produtos, o software de descarga local e os servizos dos seus integrantes.'],
    en: ['Galivelop · Software brand: workshop and Products', 'Galivelop is two things: the workshop, which creates, researches and learns in the open with the door open, and Products, the locally installed software and the services of its members.'],
  },
  equipo: { es: ['Equipo · Galivelop'], gl: ['Equipo · Galivelop'], en: ['Team · Galivelop'] },
  'participa/proponer': { es: ['Propón un proyecto · Galivelop'], gl: ['Propón un proxecto · Galivelop'], en: ['Propose a project · Galivelop'] },
  'participa/unirse': { es: ['Únete al taller · Galivelop'], gl: ['Únete ao obradoiro · Galivelop'], en: ['Join the workshop · Galivelop'] },
  productos: {
    es: ['Productos · Galivelop', 'Software de descarga local que nace en el taller de Galivelop, y las personas que lo hacen. Sin precios en la web: todo se trata por correo.'],
    gl: ['Produtos · Galivelop', 'Software de descarga local que nace no obradoiro de Galivelop, e as persoas que o fan. Sen prezos na web: todo se trata por correo.'],
    en: ['Products · Galivelop', 'Locally installed software born in the Galivelop workshop, and the people who make it. No prices on the site: everything is arranged by email.'],
  },
  'aviso-legal': {
    es: ['Aviso legal · Galivelop', 'Quién es el titular del portal de Galivelop, con qué licencias se publican su código y su contenido y qué ley se aplica.'],
    gl: ['Aviso legal · Galivelop', 'Quen é o titular do portal de Galivelop, con que licenzas se publican o seu código e o seu contido e que lei se aplica.'],
    en: ['Legal notice · Galivelop', 'Who owns the Galivelop portal, which licences cover its code and content, and which law applies.'],
  },
  privacidad: {
    es: ['Política de privacidad · Galivelop', 'Qué datos trata el portal de Galivelop: sin cookies ni analítica, solo el registro de seguridad del alojamiento y lo que tú envías al escribirnos.'],
    gl: ['Política de privacidade · Galivelop', 'Que datos trata o portal de Galivelop: sen cookies nin analítica, só o rexistro de seguridade do aloxamento e o que ti envías ao escribirnos.'],
    en: ['Privacy policy · Galivelop', 'What data the Galivelop portal handles: no cookies or analytics, only the host’s security log and what you send when you write to us.'],
  },
  terminos: {
    es: ['Términos de uso · Galivelop', 'Condiciones para usar el portal de Galivelop y para reutilizar su código y su contenido.'],
    gl: ['Termos de uso · Galivelop', 'Condicións para usar o portal de Galivelop e para reutilizar o seu código e o seu contido.'],
    en: ['Terms of use · Galivelop', 'Terms for using the Galivelop portal and for reusing its code and content.'],
  },
};
// El muro solo tiene página (y entra en el sitemap) cuando ya hay alguna publicación.
if (publicaciones.length > 0) {
  FIJAS.muro = {
    es: ['Muro · Galivelop', 'Lo que cuenta cada proyecto de Galivelop mientras avanza: pruebas, decisiones, imágenes y lo aprendido.'],
    gl: ['Muro · Galivelop', 'O que conta cada proxecto de Galivelop mentres avanza: probas, decisións, imaxes e o aprendido.'],
    en: ['Feed · Galivelop', 'What each Galivelop project shares as it moves forward: tests, decisions, images and lessons learnt.'],
  };
}

// lastmod de cada página fija: el último cambio de los datos de su contenido principal (lo que importa la página en
// src/pages/). No cuentan los de la cabecera y el pie (el menú de proyectos) ni src/i18n/textos.ts, que tiene los
// textos de todas las páginas: con ellos, cualquier cambio movería todas las fechas a la vez.
const D = 'src/data/';
const FECHA_FIJA = {
  '': masReciente(fechaGit(`${D}proyectos`, `${D}productos`, `${D}proximamente.json`, `${D}lineas.ts`, `${D}marca.ts`), ...proyectos.map((p) => p.actualizado)),
  equipo: fechaGit(`${D}equipo.json`, `${D}proyectos`),
  'participa/proponer': fechaGit(`${D}marca.ts`),
  'participa/unirse': fechaGit(`${D}marca.ts`, `${D}proyectos`),
  productos: fechaGit(`${D}productos`, `${D}equipo.json`, `${D}marca.ts`, `${D}proyectos`),
  muro: publicaciones[0]?.fecha,
  // Los textos legales: la fecha que muestran («Última actualización»).
  ...Object.fromEntries(legales.map((d) => [d.slug, d.actualizado])),
};
// Página de miembro: su ficha en equipo.json y la de sus proyectos.
const fechaMiembro = (m) => fechaGit(`${D}equipo.json`, ...m.proyectos.map((slug) => `${D}proyectos/${slug}.json`));

// Idioma de la tarjeta en redes (Open Graph; sin él, en_US).
const LOCALE = { es: 'es_ES', gl: 'gl_ES', en: 'en_US' };

// Vista previa de cada proyecto: public/proyectos/<slug>/og.jpg (1200×630, JPEG; la genera tools/og/generar.py), que las
// redes aceptan todas; si falta, la portada (WebP, sin medidas).
const vistaDe = (p) => {
  const og = `${p.portada.src.replace(/[^/]+$/, '')}og.jpg`;
  return existsSync(`public/${og}`) ? { imagen: imagenDe(og), medidas: true } : { imagen: imagenDe(p.portada.src), medidas: false };
};

const paginas = [];
for (const idioma of IDIOMAS) {
  for (const [ruta, t] of Object.entries(FIJAS)) {
    paginas.push({ idioma, ruta, titulo: t[idioma][0], descripcion: t[idioma][1] ?? FIJAS[''][idioma][1], imagen: IMAGEN, fecha: FECHA_FIJA[ruta] });
  }
  for (const p of proyectos) {
    p.vista ??= vistaDe(p);
    paginas.push({
      idioma,
      ruta: `proyectos/${p.slug}`,
      titulo: `${p.nombre} · ${p.lema[idioma].replace(/\.$/, '')} · Galivelop`,
      descripcion: p.resumen[idioma],
      imagen: p.vista.imagen,
      fecha: p.actualizado,
      proyecto: p,
    });
  }
  // Página de cada miembro (/equipo/<id>).
  for (const p of equipo) {
    paginas.push({
      idioma,
      ruta: `equipo/${p.id}`,
      titulo: `${p.nombre} · ${FIJAS.equipo[idioma][0]}`,
      // Rol + resumen: el resumen solo («Full stack desde 2017…») no dice quién es. La imagen es la de la marca:
      // la foto (webp, cuadrada y pequeña) no sirve como vista previa grande en redes.
      descripcion: `${p.rol[idioma]} · ${(p.perfil?.resumen ?? p.bio)[idioma]}`,
      imagen: IMAGEN,
      fecha: (p.fecha ??= fechaMiembro(p)),
      persona: p,
    });
  }
}

const ORG = { '@type': 'Organization', name: 'Galivelop', url: `${SITIO}/`, logo: `${SITIO}/marca/gv-logo-512.png`, email: 'alvarogarciagrana@gmail.com', sameAs: ['https://discord.gg/HWakpsAv3V', 'https://github.com/Zeldris'] };
// Tipo de schema.org de cada proyecto y sus datos propios (plataforma, categoría): van por proyecto, no por tipo.
const TIPO = {
  tarkor: { '@type': 'VideoGame', genre: 'RPG', gamePlatform: ['Windows', 'Linux', 'Steam Deck'] },
  toveriai: { '@type': 'WebApplication', applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web' },
  'galivelop-workflow': { '@type': 'SoftwareApplication', applicationCategory: 'DeveloperApplication', operatingSystem: ['Linux', 'macOS'] },
  'galivelop-image-generator': { '@type': 'SoftwareApplication', applicationCategory: 'MultimediaApplication', operatingSystem: 'Linux' },
};

/** Texto de la página en HTML simple (lo sustituye React al cargar; lo leen buscadores sin JS). */
function cuerpo(pg) {
  const enlaces = proyectos.map((p) => `<li><a href="${urlDe(pg.idioma, `proyectos/${p.slug}`)}">${esc(p.nombre)}</a>: ${esc(p.lema[pg.idioma])}</li>`).join('');
  const p = pg.proyecto;
  if (pg.ruta === 'muro') {
    const nombre = (slug) => proyectos.find((x) => x.slug === slug)?.nombre ?? slug;
    const posts = publicaciones.map((x) => `<article><h2>${esc(x.titulo[pg.idioma])}</h2><p>${esc(nombre(x.proyecto))} · ${x.fecha}</p><p>${esc(x.texto[pg.idioma])}</p>${(x.cuerpo ?? []).map((c) => `<p>${esc(c[pg.idioma])}</p>`).join('')}</article>`).join('');
    return `<main><h1>${esc(pg.titulo)}</h1><p>${esc(pg.descripcion)}</p>${posts}<ul>${enlaces}</ul></main>`;
  }
  if (pg.ruta === 'productos') {
    const lista = productos.map((x) => `<li><strong>${esc(x.nombre)}</strong>${x.estado === 'proximamente' ? ` (${PROXIMAMENTE[pg.idioma]})` : ''}: ${esc(x.queOfrece[pg.idioma])}</li>`).join('');
    const promocionados = equipo.filter((x) => x.promocionado).map((x) => `<li><a href="${urlDe(pg.idioma, `equipo/${x.id}`)}">${esc(x.nombre)}</a>: ${esc(x.rol[pg.idioma])}</li>`).join('');
    return `<main><h1>${esc(pg.titulo)}</h1><p>${esc(pg.descripcion)}</p><ul>${lista}</ul>${promocionados ? `<ul>${promocionados}</ul>` : ''}<ul>${enlaces}</ul></main>`;
  }
  const legal = legales.find((d) => d.slug === pg.ruta);
  if (legal) {
    const i = pg.idioma;
    const a = (url, texto) => `<a href="${url}">${esc(texto)}</a>`;
    const secciones = legal.secciones.map((x) => `<section><h2>${esc(x.titulo[i])}</h2>`
      + (x.parrafos ?? []).map((t) => `<p>${esc(t[i])}</p>`).join('')
      + (x.datos ? `<ul>${x.datos.map((d) => `<li>${esc(d.etiqueta[i])}: ${d.enlace ? a(d.enlace, d.valor[i]) : esc(d.valor[i])}</li>`).join('')}</ul>` : '')
      + (x.lista ? `<ul>${x.lista.map((t) => `<li>${esc(t[i])}</li>`).join('')}</ul>` : '')
      + (x.enlaces ? `<ul>${x.enlaces.map((e) => `<li>${a(e.url, e.etiqueta[i])}</li>`).join('')}</ul>` : '')
      + '</section>').join('');
    return `<main><h1>${esc(legal.titulo[i])}</h1><p>${legal.actualizado}</p>${secciones}<ul>${enlaces}</ul></main>`;
  }
  if (pg.ruta === 'equipo') {
    const miembros = equipo.map((x) => `<li><a href="${urlDe(pg.idioma, `equipo/${x.id}`)}">${esc(x.nombre)}</a>: ${esc(x.rol[pg.idioma])}</li>`).join('');
    return `<main><h1>${esc(pg.titulo)}</h1><p>${esc(pg.descripcion)}</p><ul>${miembros}</ul><ul>${enlaces}</ul></main>`;
  }
  const m = pg.persona;
  if (m) {
    const suyos = m.proyectos.map((slug) => proyectos.find((x) => x.slug === slug)).filter(Boolean)
      .map((x) => `<li><a href="${urlDe(pg.idioma, `proyectos/${x.slug}`)}">${esc(x.nombre)}</a>: ${esc(x.lema[pg.idioma])}</li>`).join('');
    const colabora = m.colabora ? `<p>${esc(m.colabora.texto[pg.idioma])} <a href="mailto:${m.colabora.correo}">${esc(m.colabora.correo)}</a></p>` : '';
    return `<main><h1>${esc(m.nombre)}</h1><p>${esc(m.rol[pg.idioma])}</p><p>${esc(m.bio[pg.idioma])}</p>${suyos ? `<ul>${suyos}</ul>` : ''}${colabora}<p><a href="${urlDe(pg.idioma, 'equipo')}">${esc(FIJAS.equipo[pg.idioma][0])}</a></p><ul>${enlaces}</ul></main>`;
  }
  if (!p) return `<main><h1>${esc(pg.titulo)}</h1><p>${esc(pg.descripcion)}</p><ul>${enlaces}</ul></main>`;
  const ext = p.enlaces.map((e) => `<li><a href="${e.url}">${esc(e.etiqueta[pg.idioma])}</a></li>`).join('');
  return `<main><h1>${esc(p.nombre)}</h1><p>${esc(p.lema[pg.idioma])}</p><p>${esc(p.resumen[pg.idioma])}</p>${p.descripcion.map((d) => `<p>${esc(d[pg.idioma])}</p>`).join('')}<ul>${p.caracteristicas.map((c) => `<li><strong>${esc(c.titulo[pg.idioma])}</strong>: ${esc(c.texto[pg.idioma])}</li>`).join('')}</ul>${ext ? `<ul>${ext}</ul>` : ''}<p><a href="${urlDe(pg.idioma, '')}">Galivelop</a></p><ul>${enlaces}</ul></main>`;
}

function datos(pg, url) {
  const p = pg.proyecto;
  const m = pg.persona;
  if (m) {
    return {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      url,
      inLanguage: pg.idioma,
      ...(pg.fecha ? { dateModified: pg.fecha } : {}),
      mainEntity: { '@type': 'Person', name: m.nombre, jobTitle: m.rol[pg.idioma], description: m.bio[pg.idioma], ...(m.foto ? { image: `${SITIO}/${m.foto}` } : {}), sameAs: m.redes.filter((r) => r.tipo !== 'correo').map((r) => r.url), memberOf: ORG },
    };
  }
  if (!p) return { '@context': 'https://schema.org', '@graph': [ORG, { '@type': 'WebSite', name: 'Galivelop', url: urlDe(pg.idioma, ''), inLanguage: pg.idioma, publisher: { '@type': 'Organization', name: 'Galivelop' } }] };
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    ...TIPO[p.slug],
    name: p.nombre,
    description: p.resumen[pg.idioma],
    url,
    image: pg.imagen,
    inLanguage: pg.idioma,
    dateModified: p.actualizado,
    keywords: p.etiquetas.join(', '),
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
    .replace(
      /(<meta property="og:site_name"[^>]*>)/,
      `$1\n    <meta property="og:locale" content="${LOCALE[pg.idioma]}" />${IDIOMAS.filter((i) => i !== pg.idioma)
        .map((i) => `\n    <meta property="og:locale:alternate" content="${LOCALE[i]}" />`)
        .join('')}`,
    )
    .replace(/(property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(property="og:title" content=")[^"]*/, `$1${esc(pg.titulo)}`)
    .replace(/(name="twitter:title" content=")[^"]*/, `$1${esc(pg.titulo)}`);
  for (const k of ['name="description"', 'property="og:description"', 'name="twitter:description"']) {
    html = html.replace(new RegExp(`(${k} content=")[^"]*`), `$1${esc(pg.descripcion)}`);
  }
  html = conImagen(html, pg.imagen);
  if (pg.proyecto) {
    const alt = esc(pg.proyecto.portada.alt[pg.idioma]);
    if (!pg.proyecto.vista.medidas) html = html.replace(/\s*<meta property="og:image:(width|height|type)"[^>]*>/g, '');
    html = html
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

writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paginas
    .map((pg) => `  <url><loc>${urlDe(pg.idioma, pg.ruta)}</loc>${pg.fecha ? `<lastmod>${pg.fecha}</lastmod>` : ''}</url>`)
    .join('\n')}\n</urlset>\n`,
);
writeFileSync(
  'dist/llms.txt',
  `# Galivelop\n\n> ${FIJAS[''].es[1]}\n\n## Proyectos\n\n${proyectos
    .map((p) => `- [${p.nombre}](${urlDe('es', `proyectos/${p.slug}`)}): ${p.resumen.es}`)
    .join('\n')}\n\n## Más\n\n${publicaciones.length > 0 ? `- [Muro](${urlDe('es', 'muro')}): publicaciones de los proyectos\n` : ''}- [Equipo](${urlDe('es', 'equipo')})\n- [Productos](${urlDe('es', 'productos')}): software de descarga local e integrantes, sin precios\n- [Únete al taller](${urlDe('es', 'participa/unirse')})\n- [Propón un proyecto](${urlDe('es', 'participa/proponer')})\n- Versiones: [galego](${urlDe('gl', '')}), [English](${urlDe('en', '')})\n`,
);
writeFileSync(`dist/${INDEXNOW_CLAVE}.txt`, INDEXNOW_CLAVE);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITIO}/sitemap.xml\n`);
console.log(`Páginas estáticas: ${paginas.length}, sitemap.xml, robots.txt y llms.txt`);
