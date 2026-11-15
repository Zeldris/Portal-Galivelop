// Tras `vite build`: crea una página HTML real por ruta e idioma (castellano sin prefijo, /gl/, /en/) (sin el 404 de GitHub Pages), con su título,
// descripción, canónica, vista previa para redes y la app ya pintada en #root (prerender), y genera sitemap.xml, robots.txt, llms.txt y la clave de IndexNow.
// La dirección del portal está en scripts/sitio.mjs.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { INDEXNOW_CLAVE, SITIO } from './sitio.mjs';

// ?v= es el hash de la imagen: las redes (Discord, X…) guardan la vista previa por su dirección.
const imagenDe = (src) => `${SITIO}/${src}?v=${createHash('sha1').update(readFileSync(`public/${src}`)).digest('hex').slice(0, 8)}`;
// Vista previa en redes de las páginas sin imagen propia, en el idioma de cada página (la generan tools/og/portal.mjs).
const IMAGEN = {
  es: imagenDe('marca/galivelop-portal.jpg'),
  gl: imagenDe('marca/galivelop-portal-gl.jpg'),
  en: imagenDe('marca/galivelop-portal-en.jpg'),
};
const ALT_PORTAL = {
  es: 'Portada de Galivelop sobre carta náutica celeste: «Hacemos reales los proyectos que parecen imposibles»',
  gl: 'Portada de Galivelop sobre carta náutica celeste: «Facemos reais os proxectos que semellan imposibles»',
  en: 'Galivelop cover on a sky-blue nautical chart: “We make seemingly impossible projects real”',
};
const conImagen = (html, url, alt) => {
  html = html
    .replace(/(property="og:image" content=")[^"]*/, `$1${url}`)
    .replace(/(name="twitter:image" content=")[^"]*/, `$1${url}`);
  return alt
    ? html
      .replace(/(property="og:image:alt" content=")[^"]*/, `$1${esc(alt)}`)
      .replace(/(name="twitter:image:alt" content=")[^"]*/, `$1${esc(alt)}`)
    : html;
};
const base = readFileSync('dist/index.html', 'utf8');
// La app real de cada página, la que luego hidrata src/main.tsx (src/entry-server.tsx, compilado por
// `vite build --ssr` en `npm run build`): lo que leen los buscadores sin JS es lo mismo que ve la persona.
const { renderizar } = await import(pathToFileURL('node_modules/.cache/prerender/entry-server.js').href);
const BASE = (process.env.BASE_PATH ?? '/Portal-Galivelop/').replace(/\/?$/, '/'); // la misma base que vite.config.ts
/**
 * HTML de #root para la página. Las precargas de imagen que React pone delante se descartan: las del <head> las pone
 * `precargas(pg)` (fuentes, chunks e imagen LCP), y las demás imágenes ya salen en el HTML.
 */
async function appDe(pg) {
  const ruta = `${BASE}${prefijo(pg.idioma)}${pg.ruta ? `${pg.ruta}/` : ''}`;
  const html = await renderizar(ruta);
  const app = html.replace(/^(?:<link\b[^>]*>)*/, '');
  const donde = `${pg.idioma}/${pg.ruta}`;
  // Un Suspense sin resolver dejaría el «cargando» (y un <script> que lo cambia) en lugar de la página.
  if (/carga-pagina|<script\b|<template\b|<!--\$[?!]/.test(app)) throw new Error(`Prerender incompleto en ${donde}`);
  if ((app.match(/<h1\b/g) ?? []).length !== 1) throw new Error(`Prerender de ${donde}: no tiene un único <h1>`);
  return { app, ruta };
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// El 404 es copia de la portada: lleva la imagen versionada y título y descripción propios en los tres idiomas.
// GitHub Pages sirve un único 404.html para toda dirección desconocida: el castellano va en el HTML y un guion
// elige gl/en según el prefijo de la dirección. Con noindex: no es una página que indexar.
const NO_ENCONTRADA = {
  es: ['Página no encontrada · Galivelop', 'Esta página no existe o ha cambiado de sitio. Vuelve a la portada de Galivelop.'],
  gl: ['Páxina non atopada · Galivelop', 'Esta páxina non existe ou cambiou de sitio. Volve á portada de Galivelop.'],
  en: ['Page not found · Galivelop', 'This page does not exist or has moved. Go back to the Galivelop home page.'],
};
const [titulo404, descripcion404] = NO_ENCONTRADA.es;
// Anclado al inicio tras la base: un segmento «en» o «gl» más adentro (un slug) no cambia el idioma.
const BASE_404 = BASE;
const guion404 = `<script>var m=new RegExp(${JSON.stringify(`^${BASE_404}(gl|en)(/|$)`)}).exec(location.pathname),T=${JSON.stringify(NO_ENCONTRADA)},l=T[m?m[1]:'es'];document.title=l[0];document.documentElement.lang=m?m[1]:'es';document.querySelector('meta[name="description"]').content=l[1];</script>`;
writeFileSync(
  'dist/404.html',
  conImagen(readFileSync('dist/404.html', 'utf8'), IMAGEN.es, ALT_PORTAL.es)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(titulo404)}</title>\n    <meta name="robots" content="noindex" />`)
    .replace(/(name="description" content=")[^"]*/, `$1${esc(descripcion404)}`)
    .replace(/(property="og:title" content=")[^"]*/, `$1${esc(titulo404)}`)
    .replace(/(property="og:description" content=")[^"]*/, `$1${esc(descripcion404)}`)
    .replace(/(name="twitter:title" content=")[^"]*/, `$1${esc(titulo404)}`)
    .replace(/(name="twitter:description" content=")[^"]*/, `$1${esc(descripcion404)}`)
    .replace(/\s*<meta property="og:url"[^>]*>/, '')
    .replace('</head>', `  ${guion404}\n  </head>`),
);

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
  .map((f) => ({ ...JSON.parse(readFileSync(`src/data/productos/${f}`, 'utf8')), archivo: `src/data/productos/${f}` }))
  .sort((a, b) => a.orden - b.orden);
// Los de un miembro, como responsable o colaborador (ADR 0004), como `productosDe` de src/data/productos.ts.
const productosDe = (id) => productos.filter((x) => x.responsable === id || x.colaboradores.includes(id));

// Lo que enseña /novedades, como src/data/novedades.ts: novedades de las fichas y publicaciones del muro, lo más
// reciente primero; el mismo día, las publicaciones antes y luego por proyecto (juntarNovedades). Se calcula una vez.
const novedadesTodas = [
  ...publicaciones.map((x) => ({ muro: true, proyecto: x.proyecto, fecha: x.fecha, titulo: x.titulo, texto: x.texto })),
  ...proyectos.flatMap((p) => (p.novedades ?? []).map((n) => ({ muro: false, proyecto: p.slug, fecha: n.fecha, texto: n.texto }))),
].sort((a, b) => b.fecha.localeCompare(a.fecha) || Number(b.muro) - Number(a.muro) || (a.muro ? 0 : a.proyecto < b.proyecto ? -1 : a.proyecto > b.proyecto ? 1 : 0));

// En el mismo orden que src/data/equipo.ts.
const equipo = JSON.parse(readFileSync('src/data/equipo.json', 'utf8')).sort((a, b) => a.orden - b.orden);

const IDIOMAS = ['es', 'gl', 'en'];
// Recorta un texto a `max` caracteres sin partir palabras, con «…» al final.
const recorta = (t, max) => (t.length <= max ? t : `${t.slice(0, max - 1).replace(/[\s·,;:]+\S*$/, '')}…`);
const prefijo = (i) => (i === 'es' ? '' : `${i}/`);
const urlDe = (i, ruta) => `${SITIO}/${prefijo(i)}${ruta ? ruta + '/' : ''}`;
const FIJAS = {
  '': {
    es: ['Galivelop · Marca de software, un taller abierto', 'Galivelop es un taller abierto de software que crea, investiga y aprende a la vista. Lo maduro tiene el código abierto y se puede montar en tu proyecto.'],
    gl: ['Galivelop · Marca de software, un obradoiro aberto', 'Galivelop é un obradoiro de software aberto que crea, investiga e aprende á vista. O maduro ten o código aberto e pódese montar no teu proxecto.'],
    en: ['Galivelop · Software brand, an open workshop', 'Galivelop is an open software workshop that creates, researches and learns in public. Mature work is open source and can be set up in your project.'],
  },
  equipo: {
    es: ['Equipo · Galivelop', 'Las personas que hacen Galivelop. Cada una con su camino, todas con ganas de construir y aprender.'],
    gl: ['Equipo · Galivelop', 'As persoas que fan Galivelop. Cada unha co seu camiño, todas con ganas de construír e aprender.'],
    en: ['Team · Galivelop', 'The people who make Galivelop. Each with their own path, all eager to build and learn.'],
  },
  'participa/proponer': {
    es: ['Propón un proyecto · Galivelop', '¿Tienes una idea que parece demasiado grande? Cuéntanosla. Leemos todas las propuestas y, si encaja en el taller, te escribimos para darle forma juntos.'],
    gl: ['Propón un proxecto · Galivelop', 'Tes unha idea que semella demasiado grande? Cóntanola. Lemos todas as propostas e, se encaixa no obradoiro, escribímosche para darlle forma xuntos.'],
    en: ['Propose a project · Galivelop', 'Got an idea that seems too big? Tell us about it. We read every proposal and, if it fits the workshop, we will get back to you to shape it together.'],
  },
  'participa/unirse': {
    es: ['Únete al taller · Galivelop', 'Buscamos gente con ganas de cooperar y aprender, tenga o no experiencia. Cuéntanos quién eres y cómo te gustaría participar.'],
    gl: ['Únete ao obradoiro · Galivelop', 'Buscamos xente con ganas de cooperar e aprender, teña ou non experiencia. Cóntanos quen es e como che gustaría participar.'],
    en: ['Join the workshop · Galivelop', 'We are looking for people who want to cooperate and learn, with or without experience. Tell us who you are and how you would like to take part.'],
  },
  novedades: {
    es: ['Novedades · Galivelop', 'Lo último de cada proyecto del taller de Galivelop, lo más reciente primero: versiones, cambios y publicaciones del muro.'],
    gl: ['Novidades · Galivelop', 'O último de cada proxecto do obradoiro de Galivelop, o máis recente primeiro: versións, cambios e publicacións do muro.'],
    en: ["What's new · Galivelop", 'The latest from each Galivelop workshop project, newest first: releases, changes and feed posts.'],
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
// Páginas de paso (ADR 0004): rutas ya compartidas que llevan a otra. Noindex, fuera del sitemap y con la canónica en
// el destino; sin JS, un meta refresh; con JS, el `<Navigate>` de su página en src/pages/.
const DE_PASO = { productos: 'equipo' };
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
  '': masReciente(fechaGit(`${D}proyectos`, `${D}proximamente.json`, `${D}lineas.ts`, `${D}marca.ts`), ...proyectos.map((p) => p.actualizado)),
  equipo: fechaGit(`${D}equipo.json`, `${D}proyectos`),
  'participa/proponer': fechaGit(`${D}marca.ts`),
  'participa/unirse': fechaGit(`${D}marca.ts`, `${D}proyectos`),
  novedades: masReciente(...novedadesTodas.map((n) => n.fecha)),
  muro: publicaciones[0]?.fecha,
  // Los textos legales: la fecha que muestran («Última actualización»).
  ...Object.fromEntries(legales.map((d) => [d.slug, d.actualizado])),
};
// Página de miembro: su ficha en equipo.json, la de sus proyectos y la de sus productos.
const fechaMiembro = (m) =>
  fechaGit(`${D}equipo.json`, ...m.proyectos.map((slug) => `${D}proyectos/${slug}.json`), ...productosDe(m.id).map((x) => x.archivo));

// Idioma de la tarjeta en redes (Open Graph; sin él, en_US).
const LOCALE = { es: 'es_ES', gl: 'gl_ES', en: 'en_US' };

// Vista previa de cada proyecto: public/proyectos/<slug>/og.jpg (1200×630, JPEG; la genera tools/og/generar.py), que las
// redes aceptan todas; en gallego e inglés, og-gl.jpg y og-en.jpg si existen (el texto de la imagen en ese idioma). Si
// falta, la portada (WebP, sin medidas). El texto alternativo, si la vista previa sale de una og-fuente: el suyo
// (`ogAlt`) o, sin él, el de la presentación (la misma composición); si sale de la portada, el de la portada.
const conFuente = (slug) => ['png', 'jpg'].some((x) => existsSync(`tools/og/fuentes/${slug}/og-fuente.${x}`));
const vistaDe = (p, idioma) => {
  const carpeta = p.portada.src.replace(/[^/]+$/, '');
  const alt = conFuente(p.slug)
    ? (p.ogAlt ?? p.presentacion?.alt ?? p.portada.alt)[idioma]
    : p.portada.alt[idioma];
  const og = [`${carpeta}og-${idioma}.jpg`, `${carpeta}og.jpg`].find((f) => existsSync(`public/${f}`));
  return og ? { imagen: imagenDe(og), medidas: true, alt } : { imagen: imagenDe(p.portada.src), medidas: false, alt: p.portada.alt[idioma] };
};

const paginas = [];
for (const idioma of IDIOMAS) {
  for (const [ruta, t] of Object.entries(FIJAS)) {
    paginas.push({ idioma, ruta, titulo: t[idioma][0], descripcion: t[idioma][1] ?? FIJAS[''][idioma][1], imagen: IMAGEN[idioma], fecha: FECHA_FIJA[ruta] });
  }
  for (const p of proyectos) {
    const vista = vistaDe(p, idioma);
    paginas.push({
      idioma,
      ruta: `proyectos/${p.slug}`,
      // `seo`, opcional en la ficha: título y descripción cortos para buscadores (si no, el lema y el resumen).
      titulo: `${p.nombre} · ${(p.seo?.titulo ?? p.lema)[idioma].replace(/\.$/, '')} · Galivelop`,
      descripcion: (p.seo?.descripcion ?? p.resumen)[idioma],
      imagen: vista.imagen,
      vista,
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
      // Buscadores: hasta 160 caracteres (Google corta lo demás); se recorta por palabra completa.
      descripcion: recorta(`${p.rol[idioma]} · ${(p.perfil?.resumen ?? p.bio)[idioma]}`, 160),
      imagen: IMAGEN[idioma],
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
    keywords: p.etiquetas.map((e) => (typeof e === 'string' ? e : e[pg.idioma])).join(', '),
    ...(p.enlaces[0] ? { sameAs: p.enlaces.map((e) => e.url) } : {}),
    creator: ORG,
  };
}

// Precarga por ruta (rendimiento): chunks JS, fuentes e imagen LCP en el <head>, para que no esperen a index.js ni al CSS.
// Los chunks salen del manifiesto de Vite (build.manifest en vite.config.ts), siguiendo `imports`; lo que ya precarga
// index.html (la entrada y sus imports) no se repite. Si no se sabe qué chunk toca a una ruta, el script falla.
const manifiesto = JSON.parse(readFileSync('dist/.vite/manifest.json', 'utf8'));
const enManifiesto = (clave, ruta) => {
  if (!manifiesto[clave]) throw new Error(`Precarga: «${clave}» no está en dist/.vite/manifest.json (ruta «${ruta}»)`);
  return manifiesto[clave];
};
const recorre = (clave, ruta, visto) => {
  if (visto.has(clave)) return;
  visto.add(clave);
  for (const i of enManifiesto(clave, ruta).imports ?? []) recorre(i, ruta, visto);
};
const deIndex = new Set();
recorre('index.html', '(entrada)', deIndex);
// Página (src/pages/) que carga cada ruta; refleja paginaDeRuta de src/paginas.ts. La portada va en el chunk de entrada.
const PAGINA_DE_RUTA = { '': undefined, equipo: 'Equipo', novedades: 'Novedades', muro: 'Muro', 'participa/proponer': 'Proponer', 'participa/unirse': 'Unirse' };
const paginaDe = (ruta) => {
  if (ruta in PAGINA_DE_RUTA) return PAGINA_DE_RUTA[ruta];
  if (ruta.startsWith('proyectos/')) return 'Proyecto';
  if (ruta.startsWith('equipo/')) return 'Miembro';
  if (legales.some((d) => d.slug === ruta)) return 'Legal';
  throw new Error(`Precarga: no sé qué página carga la ruta «${ruta}» (añádela a PAGINA_DE_RUTA)`);
};
const chunksDe = (pg) => {
  const claves = new Set();
  const pagina = paginaDe(pg.ruta);
  if (pagina) recorre(`src/pages/${pagina}.tsx`, pg.ruta, claves);
  if (pg.proyecto) recorre(`src/data/proyectos/${pg.proyecto.slug}.json`, pg.ruta, claves);
  return [...claves].filter((k) => !deIndex.has(k)).map((k) => manifiesto[k].file);
};
// Fuentes latin que pintan el primer pantallazo: titulares (Big Shoulders) y texto (Literata). La mono (datos) no.
const FUENTES = ['big-shoulders-display', 'literata'].map(
  (f) => enManifiesto(`node_modules/@fontsource-variable/${f}/files/${f}-latin-wght-normal.woff2`, '(fuentes)').file,
);
// Imagen LCP: en la ficha, la que pinta la cabecera según `cabecera` (src/pages/Proyecto.tsx); en Inicio, isobatas.svg.
// isobatas.svg no tiene variante por tema, así que es una sola imagen.
const portadaEstado = (estado, ruta) => {
  const m = new RegExp(`\\b${estado}:\\s*'([^']+)'`).exec(readFileSync('src/data/marca.ts', 'utf8').split('PORTADA_ESTADO')[1] ?? '');
  if (!m) throw new Error(`Precarga: sin portada por estado «${estado}» en src/data/marca.ts (ruta «${ruta}»)`);
  return m[1];
};
const imagenLcpDe = (pg) => {
  if (pg.ruta === '') return 'marca/isobatas.svg';
  const p = pg.proyecto;
  if (!p) return undefined;
  const modo = p.cabecera ?? 'ilustracion';
  if (modo === 'captura') return 'marca/isobatas.svg';
  if (modo === 'color') return portadaEstado(p.estado, pg.ruta);
  return p.portada.src;
};
const precargas = (pg) => {
  const lineas = [
    ...FUENTES.map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="${BASE_404}${f}" />`),
    ...chunksDe(pg).map((f) => `<link rel="modulepreload" crossorigin href="${BASE_404}${f}" />`),
  ];
  const img = imagenLcpDe(pg);
  if (img) lineas.push(`<link rel="preload" as="image" fetchpriority="high" href="${BASE_404}${img.replace(/^\//, '')}" />`);
  return lineas;
};
// Sustituye y comprueba que ocurrió: una cadena que ya no está haría la precarga desaparecer en silencio.
const reemplazaSeguro = (html, buscado, nuevo, ruta) => {
  if (!html.includes(buscado)) throw new Error(`Precarga: no encuentro «${buscado}» en el HTML de la ruta «${ruta}»`);
  return html.replace(buscado, () => nuevo);
};

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
  html = conImagen(html, pg.imagen, pg.vista?.alt ?? ALT_PORTAL[pg.idioma]);
  if (pg.vista && !pg.vista.medidas) html = html.replace(/\s*<meta property="og:image:(width|height|type)"[^>]*>/g, '');
  const { app, ruta } = await appDe(pg);
  html = reemplazaSeguro(html, '<link rel="stylesheet"', `${precargas(pg).join('\n    ')}\n    <link rel="stylesheet"`, pg.ruta || '/');
  html = html
    .replace('</head>', () => `  <script type="application/ld+json">${JSON.stringify(datos(pg, url)).replace(/</g, '\\u003c')}</script>\n  </head>`)
    // `data-prerender`: la dirección de este HTML; src/main.tsx solo lo hidrata en esa misma dirección.
    .replace('<div id="root"></div>', () => `<div id="root" data-prerender="${ruta}">${app}</div>`);
  const dir = `dist/${prefijo(pg.idioma)}${pg.ruta}`.replace(/\/$/, '');
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, html);
}

for (const idioma of IDIOMAS) {
  for (const [ruta, destino] of Object.entries(DE_PASO)) {
    const url = urlDe(idioma, destino);
    const titulo = esc(FIJAS[destino][idioma][0]);
    const descripcion = esc(FIJAS[destino][idioma][1] ?? FIJAS[''][idioma][1]);
    // Un enlace viejo que se comparte aún enseña la tarjeta de su destino: título, descripción e imagen en su idioma.
    const tarjeta = [
      `<meta name="description" content="${descripcion}" />`,
      '<meta property="og:type" content="website" />',
      '<meta property="og:site_name" content="Galivelop" />',
      `<meta property="og:locale" content="${LOCALE[idioma]}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:title" content="${titulo}" />`,
      `<meta property="og:description" content="${descripcion}" />`,
      `<meta property="og:image" content="${IMAGEN[idioma]}" />`,
      '<meta property="og:image:type" content="image/jpeg" />',
      '<meta property="og:image:width" content="1200" />',
      '<meta property="og:image:height" content="630" />',
      `<meta property="og:image:alt" content="${esc(ALT_PORTAL[idioma])}" />`,
      '<meta name="twitter:card" content="summary_large_image" />',
      `<meta name="twitter:title" content="${titulo}" />`,
      `<meta name="twitter:description" content="${descripcion}" />`,
      `<meta name="twitter:image" content="${IMAGEN[idioma]}" />`,
      `<meta name="twitter:image:alt" content="${esc(ALT_PORTAL[idioma])}" />`,
    ].join('\n    ');
    mkdirSync(`dist/${prefijo(idioma)}${ruta}`, { recursive: true });
    writeFileSync(
      `dist/${prefijo(idioma)}${ruta}/index.html`,
      `<!doctype html>\n<html lang="${idioma}">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>${titulo}</title>\n    ${tarjeta}\n    <meta name="robots" content="noindex" />\n    <link rel="canonical" href="${url}" />\n    <meta http-equiv="refresh" content="0; url=${url}" />\n  </head>\n  <body>\n    <p><a href="${url}">${titulo}</a></p>\n  </body>\n</html>\n`,
    );
  }
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
    .join('\n')}\n\n## Más\n\n${publicaciones.length > 0 ? `- [Muro](${urlDe('es', 'muro')}): publicaciones de los proyectos\n` : ''}- [Novedades](${urlDe('es', 'novedades')}): lo último de cada proyecto\n- [Equipo](${urlDe('es', 'equipo')}): las personas y, en su perfil, los productos que llevan (con el código abierto, montados en tu proyecto, sin precios)\n- [Únete al taller](${urlDe('es', 'participa/unirse')})\n- [Propón un proyecto](${urlDe('es', 'participa/proponer')})\n- Versiones: [galego](${urlDe('gl', '')}), [English](${urlDe('en', '')})\n`,
);
writeFileSync(`dist/${INDEXNOW_CLAVE}.txt`, INDEXNOW_CLAVE);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITIO}/sitemap.xml\n`);
console.log(`Páginas estáticas: ${paginas.length}, sitemap.xml, robots.txt y llms.txt`);
