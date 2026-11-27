// Tras `vite build`: crea una página HTML real por ruta e idioma (castellano sin prefijo, /gl/, /en/) (sin el 404 de GitHub Pages), con su título,
// descripción, canónica y vista previa para redes, y genera sitemap.xml, robots.txt, llms.txt y la clave de IndexNow.
// La dirección del portal está en scripts/sitio.mjs.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { estiloAcento } from '../src/data/tonos.ts';
import { ANCHO_ESTADO, MARCA, MEDIA_CUADRADA, PORTADA_ESTADO, SIZES_CABECERA, SIZES_PORTADA_PRODUCTO, cuadradaDe, srcsetCabecera, srcsetPortadaProducto } from '../src/data/marca.ts';
import { muroVisible } from '../src/data/muro-umbral.ts';
import { textos } from '../src/i18n/textos.ts';
import { paginaDeSegmentos } from '../src/rutas.ts';
import { INDEXNOW_CLAVE, SITIO } from './sitio.mjs';
import { idsFeed as idsDelFeed } from './id-feed.mjs';

// ?v= es el hash de la imagen: las redes (Discord, X…) guardan la vista previa por su dirección.
const imagenDe = (src) => `${SITIO}/${src}?v=${createHash('sha1').update(readFileSync(`public/${src}`)).digest('hex').slice(0, 8)}`;
// Vista previa en redes de las páginas sin imagen propia, en el idioma de cada página (la generan tools/og/portal.mjs).
const IMAGEN = {
  es: imagenDe('marca/galivelop-portal.jpg'),
  gl: imagenDe('marca/galivelop-portal-gl.jpg'),
  en: imagenDe('marca/galivelop-portal-en.jpg'),
};
const ALT_PORTAL = {
  es: 'Portada de Galivelop: «Hacemos reales los proyectos que parecen imposibles», junto a una rosa de los vientos flotando en el mar grabado',
  gl: 'Portada de Galivelop: «Facemos reais os proxectos que semellan imposibles», xunto a unha rosa dos ventos flotando no mar gravado',
  en: 'Galivelop cover: “We make seemingly impossible projects real”, beside a compass rose floating in an engraved sea',
};
// Texto alternativo de la vista previa de un producto (tools/og/producto.html): «<nombre> (<alias>), <esto>: «<lema>»», con las comillas de cada idioma.
const ALT_PRODUCTO = { es: ['producto de Galivelop', '«', '»'], gl: ['produto de Galivelop', '«', '»'], en: ['a Galivelop product', '“', '”'] };
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
const BASE_404 = (process.env.BASE_PATH ?? '/Portal-Galivelop/').replace(/\/?$/, '/'); // la misma base que vite.config.ts
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
  .map((f) => JSON.parse(readFileSync(`src/data/legal/${f}`, 'utf8')))
  .sort((a, b) => a.orden - b.orden); // como el Pie de React (src/data/legal.ts)

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

// El muro solo existe con el mínimo de publicaciones (src/data/muro-umbral.ts, el mismo que usa la web). MURO_UMBRAL solo
// se honra bajo vitest (src/estatico-muro.test.ts) y si es un entero >= 1: en el build real no cambia nada.
const umbralDeTest = /^[1-9]\d*$/.test(process.env.MURO_UMBRAL ?? '') && process.env.VITEST ? Number(process.env.MURO_UMBRAL) : undefined;
const hayMuro = muroVisible(publicaciones.length, umbralDeTest);

// Productos de la marca (src/data/productos/<slug>.json), en el mismo orden que src/data/productos.ts.
const productos = readdirSync('src/data/productos')
  .filter((f) => f.endsWith('.json'))
  .map((f) => ({ ...JSON.parse(readFileSync(`src/data/productos/${f}`, 'utf8')), archivo: `src/data/productos/${f}` }))
  .sort((a, b) => a.orden - b.orden);
// Los de un miembro, como responsable o colaborador (ADR 0004), como `productosDe` de src/data/productos.ts.
const productosDe = (id) => productos.filter((x) => x.responsable === id || x.colaboradores.includes(id));
// Entradas del diario del taller (src/data/diario/<slug>.json), de la más nueva a la más vieja, como src/data/diario.ts.
const entradas = readdirSync('src/data/diario')
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(`src/data/diario/${f}`, 'utf8')))
  .sort((a, b) => b.fecha.localeCompare(a.fecha) || a.slug.localeCompare(b.slug));
// Minutos de lectura, como `minutosLectura` de src/data/diario.ts (src/estatico.test.ts comprueba que coinciden): palabras
// de títulos, bajada y bloques del idioma / 200, hacia arriba, mínimo 1.
const minutosLectura = (e, i) => {
  const t = [e.titulo[i], e.bajada[i]];
  for (const s of e.secciones) {
    t.push(s.etiqueta[i], s.titulo[i]);
    for (const b of s.bloques) {
      if (b.tipo === 'parrafo') t.push(b.texto[i]);
      else if (b.tipo === 'decision') t.push(b.texto[i], b.cita[i]);
      else if (b.tipo === 'lista') t.push(b.titulo[i], ...b.items.map((x) => x[i]));
      else if (b.tipo === 'imagen') { if (b.pie) t.push(b.pie[i]); }
      else if (b.tipo === 'galeria') { for (const g of b.imagenes) if (g.pie) t.push(g.pie[i]); }
      else t.push(b.pie[i]);
    }
  }
  return Math.max(1, Math.ceil(t.reduce((n, x) => n + x.split(/\s+/).filter(Boolean).length, 0) / 200));
};
const PROXIMAMENTE = { es: 'Próximamente', gl: 'Proximamente', en: 'Coming soon' };
const TITULO_PRODUCTOS = { es: 'Productos', gl: 'Produtos', en: 'Products' };

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
// Feed Atom de /novedades, uno por idioma (lo escribe el final de este script).
const feedDe = (i) => `${urlDe(i, 'novedades')}feed.xml`;
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
  productos: {
    es: ['Productos · Galivelop', 'Lo que hacen por su cuenta quienes forman el taller de Galivelop: Galivelop Developer (GalivelopCode) y Galivelop Evaluator (GVE). El taller no los vende; cada responsable los atiende.'],
    gl: ['Produtos · Galivelop', 'O que fan pola súa conta quen forma o obradoiro de Galivelop: Galivelop Developer (GalivelopCode) e Galivelop Evaluator (GVE). O obradoiro non os vende; cada responsable atende os seus.'],
    en: ['Products · Galivelop', 'What the people who make up the Galivelop workshop do on their own: Galivelop Developer (GalivelopCode) and Galivelop Evaluator (GVE). The workshop does not sell them; each lead looks after theirs.'],
  },
  diario: {
    es: ['Diario del taller · Galivelop', 'Artículos largos sobre cómo se construye lo que hace Galivelop: las decisiones del taller, lo que se probó y lo que cambió.'],
    gl: ['Diario do obradoiro · Galivelop', 'Artigos longos sobre como se constrúe o que fai Galivelop: as decisións do obradoiro, o que se probou e o que cambiou.'],
    en: ['Workshop journal · Galivelop', 'Long reads on how Galivelop builds what it makes: the workshop’s decisions, what was tried and what changed.'],
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
// Páginas de paso: rutas ya compartidas que llevan a otra. Noindex, fuera del sitemap y con la canónica en el destino;
// sin JS, un meta refresh; con JS, el `<Navigate>` de su página en src/pages/. Hoy no hay ninguna (`/productos` lo fue
// de ADR 0004 a 2026-11-24, y ahora es el índice de los productos).
const DE_PASO = {};
// El muro solo tiene página (y entra en el sitemap) con el mínimo de publicaciones.
if (hayMuro) {
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
  productos: masReciente(...productos.map((x) => x.pagina?.actualizado)),
  diario: masReciente(...entradas.map((e) => e.fecha)),
  'participa/proponer': fechaGit(`${D}marca.ts`),
  'participa/unirse': fechaGit(`${D}marca.ts`, `${D}proyectos`),
  novedades: masReciente(...novedadesTodas.map((n) => n.fecha)),
  muro: hayMuro ? publicaciones[0]?.fecha : undefined,
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
  // Página de cada producto que la tiene (/productos/<slug>, ADR 0005): el alias va en el título para que se encuentre
  // por los dos nombres. La vista previa es su og.jpg (og-gl.jpg, og-en.jpg; las genera tools/og/producto.mjs) y, sin
  // ella, su portada (WebP, sin medidas) o la del portal.
  for (const x of productos.filter((x) => x.pagina)) {
    const og = [`productos/${x.slug}/og-${idioma}.jpg`, `productos/${x.slug}/og.jpg`].find((f) => existsSync(`public/${f}`));
    const vista = og
      ? { imagen: imagenDe(og), medidas: true, alt: `${x.nombre}${x.alias ? ` (${x.alias})` : ''}, ${ALT_PRODUCTO[idioma][0]}: ${ALT_PRODUCTO[idioma][1]}${x.pagina.lema.map((t) => t[idioma]).join(' ')}${ALT_PRODUCTO[idioma][2]}` }
      : x.pagina.portada
        ? { imagen: imagenDe(x.pagina.portada.src), medidas: false, alt: x.pagina.portada.alt[idioma] }
        : undefined;
    paginas.push({
      idioma,
      ruta: `productos/${x.slug}`,
      titulo: `${x.nombre}${x.alias ? ` (${x.alias})` : ''} · ${x.pagina.seo.titulo[idioma]} · Galivelop`,
      descripcion: x.pagina.seo.descripcion[idioma],
      // Sin og ni portada, la vista previa es la del portal.
      imagen: vista?.imagen ?? IMAGEN[idioma],
      vista,
      fecha: x.pagina.actualizado,
      producto: x,
    });
  }
  // Página de cada entrada del diario (/diario/<slug>): su fecha es la `fecha` de la entrada (lastmod y datePublished).
  for (const e of entradas) {
    paginas.push({
      idioma,
      ruta: `diario/${e.slug}`,
      titulo: `${e.titulo[idioma]} · Galivelop`,
      descripcion: e.descripcion[idioma],
      // La portada de la entrada, si la hay (URL absoluta con ?v=, como las fichas); si no, la del portal.
      imagen: e.portada ? imagenDe(e.portada.src) : IMAGEN[idioma],
      vista: e.portada ? { imagen: imagenDe(e.portada.src), medidas: false, alt: e.portada.alt[idioma] } : undefined,
      fecha: e.fecha,
      entrada: e,
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

// ---------- Cabecera y pie estáticos ----------
// Las mismas clases y la misma estructura que src/components/Cabecera.tsx, MenuProyectos.tsx y Pie.tsx, con los textos de
// src/i18n/textos.ts: sin JavaScript hay menú, selector de idioma y pie con enlaces reales; con JavaScript se ven igual
// y React los sustituye al montar (el contenido estático se oculta hasta entonces: ver `data-estatico` en index.html).
const T = (i, clave) => textos[i][clave];
const hrefDe = (i, ruta) => `${BASE_404}${prefijo(i)}${ruta ? ruta + '/' : ''}`;
const enlace = (href, texto, extra = '') => `<a${extra} href="${href}">${esc(texto)}</a>`;
// Monograma GV de src/components/Logo.tsx.
const LOGO = (tamano) =>
  `<span class="logo"><svg width="${tamano}" height="${tamano}" viewBox="0 0 128 128" aria-hidden="true" class="marca-gd"><path d="M0 0H100L128 28V128H0Z" fill="var(--celeste, #1aa6df)"/><g fill="none" stroke="var(--blanco, #fff)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"><path d="M55.4 45.6 A24 24 0 1 0 64 64"/><path d="M50 64 H80"/><path d="M71 40 L89.5 88 L108 40"/></g></svg><span class="logo-texto"><span class="logo-gali">Gali</span>velop</span></span>`;
// Iconos de lucide-react (los mismos que usan la cabecera y el pie).
const ICONO = (tamano, trazos) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${tamano}" height="${tamano}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${trazos}</svg>`;
const ICONOS = {
  chevron: ICONO(15, '<path d="m6 9 6 6 6-6"/>'),
  luna: ICONO(18, '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>'),
  sol: ICONO(18, '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'),
  menu: ICONO(18, '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>'),
  correo: ICONO(18, '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>'),
};
// Discord y GitHub: los de src/components/IconoDiscord.tsx e IconoGitHub.tsx.
// Si el componente cambia y lo extraído deja de ser un SVG limpio (JSX que se cuela), el build falla en vez de publicarlo.
const leerIcono = (archivo) => {
  const svg = readFileSync(`src/components/${archivo}`, 'utf8')
    .match(/<svg[\s\S]*?<\/svg>/)?.[0]
    ?.replace(/width=\{tamano\} height=\{tamano\}/, 'width="18" height="18"')
    .replace(/\s+/g, ' ');
  if (!svg?.startsWith('<svg') || /[{}]/.test(svg)) throw new Error(`paginas-estaticas: no se pudo sacar el SVG de src/components/${archivo}`);
  return svg;
};
const ICONO_DISCORD = leerIcono('IconoDiscord.tsx');
const ICONO_GITHUB = leerIcono('IconoGitHub.tsx');

function cabecera(i, ruta) {
  const proyectosMenu = proyectos
    .map((p) => `<li><a href="${hrefDe(i, `proyectos/${p.slug}`)}" class="submenu-proyecto"><img src="${BASE_404}${p.portada.mini}" width="56" height="40" alt="" loading="lazy" decoding="async" /><span class="submenu-texto"><strong>${esc(p.nombre)}</strong><span>${esc(p.categoria[i])}</span></span></a></li>`)
    .join('');
  const idiomas = IDIOMAS.map((j) => `<a lang="${j}"${j === i ? ' aria-current="page"' : ''} href="${hrefDe(j, ruta)}">${j.toUpperCase()}</a>`).join('');
  return `<header class="cabecera"><a class="saltar" href="#contenido">${esc(T(i, 'nav.saltar'))}</a><div class="contenedor cabecera-fila">`
    + `<a class="cabecera-logo" aria-label="Galivelop" href="${hrefDe(i, '')}">${LOGO(36)}</a>`
    + `<nav id="menu-principal" class="cabecera-nav" aria-label="${esc(T(i, 'nav.menu'))}"><div class="nav-grupo nav-taller" role="group" aria-labelledby="nav-taller-etiqueta"><span class="nav-etiqueta" id="nav-taller-etiqueta">${esc(T(i, 'nav.taller'))}</span>`
    + `<div class="submenu"><button type="button" class="submenu-boton" aria-expanded="false" aria-controls="submenu-proyectos">${esc(T(i, 'nav.proyectos'))} ${ICONOS.chevron}</button><div id="submenu-proyectos" class="submenu-panel"><ul>${proyectosMenu}</ul><a class="submenu-todos" href="${hrefDe(i, '')}#proyectos">${esc(T(i, 'nav.proyectos.todos'))}</a></div></div>`
    + enlace(`${hrefDe(i, '')}#lineas`, T(i, 'nav.lineas'))
    + enlace(`${hrefDe(i, '')}#sobre`, T(i, 'nav.sobre'))
    + enlace(hrefDe(i, 'novedades'), T(i, 'sec.novedades'))
    + enlace(hrefDe(i, 'equipo'), T(i, 'nav.equipo'))
    + enlace(`${hrefDe(i, '')}#participa`, T(i, 'nav.contacto'))
    + '</div>' + enlace(hrefDe(i, 'productos'), T(i, 'productos.titulo'), ' class="nav-productos"')
    + enlace(hrefDe(i, 'diario'), T(i, 'nav.diario'), ' class="nav-diario"')
    + `</nav><div class="cabecera-ajustes"><div class="idiomas" role="group" aria-label="${esc(T(i, 'idioma.etiqueta'))}">${idiomas}</div>`
    // Los dos estados del botón; el CSS de index.html muestra el que toca según html[data-tema] (lo fija el script inline).
    + `<button type="button" class="boton-icono tema-estatico tema-estatico-oscuro" aria-label="${esc(T(i, 'tema.oscuro'))}">${ICONOS.luna}</button>`
    + `<button type="button" class="boton-icono tema-estatico tema-estatico-claro" aria-label="${esc(T(i, 'tema.claro'))}">${ICONOS.sol}</button>`
    + `<button type="button" class="boton-icono boton-menu" aria-expanded="false" aria-controls="menu-principal" aria-label="${esc(T(i, 'nav.menu'))}">${ICONOS.menu}</button></div></div></header>`;
}

function pie(i) {
  const columna = (id, titulo, items) => `<nav class="pie-columna" aria-labelledby="${id}"><h2 id="${id}">${esc(titulo)}</h2><ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul></nav>`;
  const externo = (href, etiqueta, icono) => `<a href="${href}" target="_blank" rel="noreferrer" aria-label="${etiqueta}" title="${etiqueta}">${icono}</a>`;
  return `<footer class="pie" data-estatico><img class="pie-rosa" src="${BASE_404}marca/rosa-vientos.webp" alt="" width="280" height="280" loading="lazy" /><div class="contenedor pie-rejilla"><div class="pie-marca">${LOGO(30)}<p>${esc(T(i, 'pie.hecho'))}</p><div class="pie-redes">`
    + externo(MARCA.discord, 'Discord', ICONO_DISCORD)
    + externo(MARCA.github, 'GitHub', ICONO_GITHUB)
    + `<a href="mailto:${MARCA.correo}" aria-label="${MARCA.correo}" title="${MARCA.correo}">${ICONOS.correo}</a></div></div>`
    + columna('pie-taller', T(i, 'nav.taller'), proyectos.map((p) => enlace(hrefDe(i, `proyectos/${p.slug}`), p.nombre)))
    + columna('pie-galivelop', 'Galivelop', [
      enlace(hrefDe(i, 'equipo'), T(i, 'nav.equipo')),
      enlace(`${hrefDe(i, '')}#sobre`, T(i, 'nav.sobre')),
      enlace(hrefDe(i, 'novedades'), T(i, 'sec.novedades')),
      ...(hayMuro ? [enlace(hrefDe(i, 'muro'), T(i, 'nav.muro'))] : []),
    ])
    + columna('pie-participa', T(i, 'nav.contacto'), [enlace(hrefDe(i, 'participa/proponer'), T(i, 'prop.titulo')), enlace(hrefDe(i, 'participa/unirse'), T(i, 'unir.titulo'))])
    + columna('pie-legal', T(i, 'pie.legal'), legales.map((d) => enlace(hrefDe(i, d.slug), d.titulo[i])))
    + `</div><div class="contenedor pie-base"><p>© ${new Date().getFullYear()} Galivelop · ${esc(MARCA.titular)}</p><p>${esc(T(i, 'pie.codigo'))}: <a href="${MARCA.repositorio}/blob/main/LICENSE" target="_blank" rel="noreferrer">MIT</a> · ${esc(T(i, 'pie.contenido'))}: <a href="${MARCA.licenciaContenido}" target="_blank" rel="noreferrer">CC BY 4.0</a></p></div></footer>`;
}

// Estilos de la cabecera estática: el selector de idioma son enlaces (en la app, botones: `.idiomas button`) y, sin
// JavaScript, el menú móvil no se abre, así que se muestra desplegado en la fila y el submenú se abre al pasar o enfocar.
const ESTILO_ESTATICO = `<style>.idiomas a{padding:4px 10px;font:var(--datos);font-size:.72rem;letter-spacing:var(--datos-espaciado);text-transform:uppercase;color:var(--texto-3);text-decoration:none}.idiomas a[aria-current=page]{background:var(--tinta);color:var(--papel)}@media(max-width:26.875em){.idiomas a{padding:4px 8px}}</style>
    <noscript><style>.cabecera-ajustes .boton-icono{display:none}.submenu:hover .submenu-panel,.submenu:focus-within .submenu-panel{opacity:1;visibility:visible;transform:none}.submenu-boton{pointer-events:none}@media(max-width:68.75em){.cabecera-fila{flex-wrap:wrap;height:auto;padding-block:8px}.cabecera-nav{display:flex;position:static;order:3;width:100%;flex-direction:row;flex-wrap:wrap;margin:0;padding:0;border:0;box-shadow:none;max-height:none;overflow:visible;background:none}.cabecera-nav a{padding:8px 9px;font-size:.8rem}.submenu{display:none}}</style></noscript>`;

// h1 de la app en las páginas cuyo título del <title> lleva «· Galivelop» (src/pages/Inicio, Equipo, Muro, Proponer, Unirse).
const H1 = {
  '': (i) => `${T(i, 'hero.titulo1')} ${T(i, 'hero.titulo2')}`,
  equipo: (i) => T(i, 'equipo.titulo'),
  productos: (i) => T(i, 'productos.titulo'),
  muro: (i) => T(i, 'muro.titulo'),
  'participa/proponer': (i) => T(i, 'prop.titulo'),
  'participa/unirse': (i) => T(i, 'unir.titulo'),
};
const h1De = (pg) => esc(H1[pg.ruta]?.(pg.idioma) ?? pg.titulo);

/** Texto de la página en HTML simple (lo sustituye React al cargar; lo leen buscadores sin JS). */
function cuerpo(pg) {
  const enlaces = proyectos.map((p) => `<li><a href="${urlDe(pg.idioma, `proyectos/${p.slug}`)}">${esc(p.nombre)}</a>: ${esc(p.lema[pg.idioma])}</li>`).join('');
  const p = pg.proyecto;
  if (pg.ruta === 'muro') {
    const nombre = (slug) => proyectos.find((x) => x.slug === slug)?.nombre ?? slug;
    const posts = publicaciones.map((x) => `<article><h2>${esc(x.titulo[pg.idioma])}</h2><p>${esc(nombre(x.proyecto))} · ${x.fecha}</p><p>${esc(x.texto[pg.idioma])}</p>${(x.cuerpo ?? []).map((c) => `<p>${esc(c[pg.idioma])}</p>`).join('')}</article>`).join('');
    return `<main id="contenido" class="contenedor" data-estatico><h1>${h1De(pg)}</h1><p>${esc(pg.descripcion)}</p>${posts}<ul>${enlaces}</ul></main>`;
  }
  if (pg.ruta === 'novedades') {
    const nombre = (slug) => proyectos.find((x) => x.slug === slug)?.nombre ?? slug;
    const lista = novedadesTodas.map((x) => `<li><time datetime="${x.fecha}">${x.fecha}</time> · <a href="${x.muro && hayMuro ? `${urlDe(pg.idioma, 'muro')}?proyecto=${x.proyecto}` : urlDe(pg.idioma, `proyectos/${x.proyecto}`)}">${esc(nombre(x.proyecto))}</a>: ${x.titulo ? `<strong>${esc(x.titulo[pg.idioma])}</strong> ` : ''}${esc(x.texto[pg.idioma])}</li>`).join('');
    return `<main id="contenido" class="contenedor" data-estatico><h1>${esc(pg.titulo.split(' · ')[0])}</h1><p>${esc(pg.descripcion)}</p><p><a href="${feedDe(pg.idioma)}" type="application/atom+xml">${esc(T(pg.idioma, 'novedades.feed'))}</a></p><ul>${lista}</ul><ul>${enlaces}</ul></main>`;
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
    return `<main id="contenido" class="contenedor" data-estatico><h1>${esc(legal.titulo[i])}</h1><p>${legal.actualizado}</p>${secciones}<ul>${enlaces}</ul></main>`;
  }
  if (pg.ruta === 'equipo') {
    const miembros = equipo.map((x) => `<li><a href="${urlDe(pg.idioma, `equipo/${x.id}`)}">${esc(x.nombre)}</a>: ${esc(x.rol[pg.idioma])}</li>`).join('');
    return `<main id="contenido" class="contenedor" data-estatico><h1>${h1De(pg)}</h1><p>${esc(pg.descripcion)}</p><ul>${miembros}</ul><ul>${enlaces}</ul></main>`;
  }
  if (pg.ruta === 'productos') {
    const i = pg.idioma;
    const tarjetas = productos.map((x) => {
      const r = equipo.find((e) => e.id === x.responsable);
      const nombre = `${x.nombre}${x.alias ? ` · ${x.alias}` : ''}`;
      return `<li><h2>${x.pagina ? `<a href="${urlDe(i, `productos/${x.slug}`)}">${esc(nombre)}</a>` : esc(nombre)}</h2>${x.estado === 'proximamente' ? `<p>${esc(PROXIMAMENTE[i])}</p>` : ''}<p>${esc(x.queOfrece[i])}</p>${r ? `<p>${esc(T(i, 'productos.responsable'))}: <a href="${urlDe(i, `equipo/${r.id}`)}">${esc(r.nombre)}</a></p>` : ''}</li>`;
    }).join('');
    return `<main id="contenido" class="contenedor" data-estatico><nav aria-label="${esc(T(i, 'productos.migas'))}"><a href="${urlDe(i, '')}">${esc(T(i, 'productos.inicio'))}</a> / ${esc(T(i, 'productos.titulo'))}</nav><h1>${h1De(pg)}</h1><p>${esc(T(i, 'productos.intro'))}</p><ul>${tarjetas}</ul><p>${esc(T(i, 'productos.nota'))}</p></main>`;
  }
  if (pg.ruta === 'diario') {
    const i = pg.idioma;
    const tarjetas = entradas.map((e) => {
      const a = equipo.find((m) => m.id === e.autor);
      return `<li><article><p><time datetime="${e.fecha}">${e.fecha}</time> · ${esc(T(i, `diario.tipo.${e.tipo ?? 'taller'}`))}${a ? ` · ${esc(T(i, 'diario.escribe'))}: <a href="${urlDe(i, `equipo/${a.id}`)}">${esc(a.nombre)}</a>` : ''} · ${esc(T(i, 'diario.lectura'))}: ${esc(T(i, 'diario.lecturaMin').replace('{min}', minutosLectura(e, i)))}</p><h2><a href="${urlDe(i, `diario/${e.slug}`)}">${esc(e.titulo[i])}</a></h2><p>${esc(e.bajada[i])}</p></article></li>`;
    }).join('');
    return `<main id="contenido" class="contenedor" data-estatico><nav aria-label="${esc(T(i, 'productos.migas'))}"><a href="${urlDe(i, '')}">${esc(T(i, 'diario.inicio'))}</a> / ${esc(T(i, 'diario.titulo'))}</nav><h1>${esc(T(i, 'diario.titulo'))}</h1><p>${esc(T(i, 'diario.intro'))}</p>${entradas.length ? `<ul>${tarjetas}</ul>` : `<p>${esc(T(i, 'diario.vacio'))}</p>`}</main>`;
  }
  const entrada = pg.entrada;
  if (entrada) {
    // Lo mismo que src/pages/EntradaDiario.tsx, en HTML simple. `código` entre comillas invertidas es <code> (src/utils/codigo.tsx).
    const i = pg.idioma;
    const conCodigo = (t) => esc(t).replace(/`([^`]+)`/g, '<code>$1</code>');
    const autor = equipo.find((m) => m.id === entrada.autor);
    const ficha = proyectos.find((x) => x.slug === entrada.proyecto);
    const figura = (g) => `<figure><img src="${BASE_404}${g.src}" alt="${esc(g.alt[i])}" loading="lazy" decoding="async" />${g.pie ? `<figcaption>${esc(g.pie[i])}</figcaption>` : ''}</figure>`;
    const bloque = (b) => {
      if (b.tipo === 'imagen') return figura(b);
      if (b.tipo === 'galeria') return b.imagenes.map(figura).join('');
      if (b.tipo === 'parrafo') return `<p>${conCodigo(b.texto[i])}</p>`;
      if (b.tipo === 'decision') return `<div><p><strong>${esc(T(i, 'diario.decision'))}</strong></p><p>${conCodigo(b.texto[i])}</p><p>${esc(b.cita[i])}</p></div>`;
      if (b.tipo === 'lista') return `<p><strong>${esc(b.titulo[i])}</strong></p><ul>${b.items.map((t) => `<li>${conCodigo(t[i])}</li>`).join('')}</ul>`;
      // La animación de una ficha: como en la ficha, sin JS cada paso queda leído (título y narración) en una lista.
      const a = proyectos.find((x) => x.slug === b.proyecto)?.animaciones?.find((x) => x.id === b.id);
      return `<figure>${a ? `<ol>${a.pasos.map((x) => `<li><strong>${esc(x.titulo[i])}</strong>: ${esc(x.narracion[i])}</li>`).join('')}</ol>` : ''}<figcaption>${esc(b.pie[i])}</figcaption></figure>`;
    };
    const secciones = entrada.secciones.map((s) => `<section><h2>${esc(s.etiqueta[i])}: ${esc(s.titulo[i])}</h2>${s.bloques.map(bloque).join('')}</section>`).join('');
    const n = entradas.findIndex((e) => e.slug === entrada.slug);
    const vecina = (e, t) => (e ? `<li><a href="${urlDe(i, `diario/${e.slug}`)}">${esc(T(i, t))} ${esc(e.titulo[i])}</a></li>` : '');
    const pie = [vecina(entradas[n + 1], 'diario.anterior'), vecina(entradas[n - 1], 'diario.siguiente'), ficha ? `<li><a href="${urlDe(i, `proyectos/${ficha.slug}`)}">${esc(T(i, 'diario.verFicha').replace('{proyecto}', ficha.nombre))}</a></li>` : ''].join('');
    const meta = `<p><time datetime="${entrada.fecha}">${entrada.fecha}</time> · ${esc(T(i, `diario.tipo.${entrada.tipo ?? 'taller'}`))}${autor ? ` · ${esc(T(i, 'diario.escribe'))}: <a href="${urlDe(i, `equipo/${autor.id}`)}">${esc(autor.nombre)}</a>` : ''} · ${esc(T(i, 'diario.lectura'))}: ${esc(T(i, 'diario.lecturaMin').replace('{min}', minutosLectura(entrada, i)))}${ficha ? ` · ${esc(T(i, 'diario.proyecto'))}: <a href="${urlDe(i, `proyectos/${ficha.slug}`)}">${esc(ficha.nombre)}</a>` : ''}</p>`;
    return `<main id="contenido" class="contenedor" data-estatico><nav aria-label="${esc(T(i, 'productos.migas'))}"><a href="${urlDe(i, '')}">${esc(T(i, 'diario.inicio'))}</a> / <a href="${urlDe(i, 'diario')}">${esc(T(i, 'diario.titulo'))}</a> / ${esc(entrada.titulo[i])}</nav><article><h1>${esc(entrada.titulo[i])}</h1><p>${esc(entrada.bajada[i])}</p>${entrada.portada ? figura(entrada.portada) : ''}${meta}${secciones}</article><ul>${pie}</ul></main>`;
  }
  const x = pg.producto;
  if (x) {
    // Lo mismo que src/pages/Producto.tsx, en HTML simple: sin precios y sin enlace al repositorio (es privado).
    const i = pg.idioma;
    const g = x.pagina;
    const par = (lista) => lista.map((e) => `<li><strong>${esc(e.titulo[i])}</strong>: ${esc(e.texto[i])}</li>`).join('');
    const asunto = encodeURIComponent(T(i, 'productos.asunto').replace('{producto}', x.nombre));
    const tecnico = g.tecnico.datos.map((d) => `<dt>${esc(d.etiqueta[i])}</dt><dd>${esc(d.valor[i])}</dd>`).join('');
    const responsable = equipo.find((e) => e.id === x.responsable);
    const datosProducto = [x.alias ? `${esc(T(i, 'producto.alias'))}: ${esc(x.alias)}` : '', x.estado === 'proximamente' ? PROXIMAMENTE[i] : '']
      .filter(Boolean)
      .join(' · ');
    const lista = (t, items) => `<h2>${esc(t[i])}</h2><ul>${items.map((e) => `<li>${esc(e[i])}</li>`).join('')}</ul>`;
    const problema = g.problema ? `<h2>${esc(g.problema.titulo[i])}</h2><p>${esc(g.problema.texto[i])}</p>` : '';
    const beneficios = g.beneficios ? `<h2>${esc(g.beneficios.titulo[i])}</h2><ul>${par(g.beneficios.items)}</ul>` : '';
    const figuras = (g.figuras ?? []).map((f) => `<figure><img src="${SITIO}/${f.src.replace(/^\//, '')}" width="${f.ancho}" height="${f.alto}" alt="${esc(f.alt[i])}" loading="lazy">${f.pie ? `<figcaption>${esc(f.pie[i])}</figcaption>` : ''}</figure>`).join('');
    const paraQuien = g.paraQuien ? lista(g.paraQuien.titulo, g.paraQuien.items) : '';
    const estado = g.estadoTexto ? `<p>${esc(g.estadoTexto[i])}</p>` : '';
    const requisitos = g.requisitos.items.length ? `<h2>${esc(T(i, 'producto.requisitos.titulo'))}</h2>${g.requisitos.intro ? `<p>${esc(g.requisitos.intro[i])}</p>` : ''}<dl>${g.requisitos.items.map((d) => `<dt>${esc(d.etiqueta[i])}</dt><dd>${esc(d.valor[i])}</dd>`).join('')}</dl>` : '';
    const papeles = g.tecnico.papeles?.length ? `<p>${g.tecnico.papeles.map((r) => esc(r[i])).join(' · ')}.${g.tecnico.papelesTexto ? ` ${esc(g.tecnico.papelesTexto[i])}` : ''}</p>` : '';
    return `<main id="contenido" class="contenedor" data-estatico><h1>${esc(x.nombre)}</h1>${datosProducto ? `<p>${datosProducto}</p>` : ''}<p>${g.lema.map((l) => esc(l[i])).join(' ')}</p><p>${esc(g.entrada[i])}</p>${problema}${beneficios}<h2>${esc(g.pasosTitulo[i])}</h2><ol>${par(g.pasos)}</ol>${figuras}<h2>${esc(g.garantiasTitulo[i])}</h2><ul>${par(g.garantias)}</ul>${paraQuien}<h2>${esc(g.contacto.titulo[i])}</h2>${estado}<p>${esc(g.contacto.texto[i])}</p><p><a href="mailto:${MARCA.correo}?subject=${asunto}">${esc(T(i, 'producto.interesa'))}</a> · ${esc(MARCA.correo)}</p>${requisitos}<h2>${esc(T(i, 'producto.tecnico.titulo'))}</h2>${papeles}<dl>${tecnico}</dl>${responsable ? `<p><a href="${urlDe(i, `equipo/${responsable.id}`)}">${esc(responsable.nombre)}</a></p>` : ''}<ul>${enlaces}</ul></main>`;
  }
  const m = pg.persona;
  if (m) {
    const suyos = m.proyectos.map((slug) => proyectos.find((x) => x.slug === slug)).filter(Boolean)
      .map((x) => `<li><a href="${urlDe(pg.idioma, `proyectos/${x.slug}`)}">${esc(x.nombre)}</a>: ${esc(x.lema[pg.idioma])}</li>`).join('');
    const productosSuyos = productosDe(m.id)
      .map((x) => `<li>${x.pagina ? `<a href="${urlDe(pg.idioma, `productos/${x.slug}`)}"><strong>${esc(x.nombre)}</strong></a>` : `<strong>${esc(x.nombre)}</strong>`}${x.estado === 'proximamente' ? ` (${PROXIMAMENTE[pg.idioma]})` : ''}: ${esc(x.queOfrece[pg.idioma])}</li>`).join('');
    const colabora = m.colabora ? `<p>${esc(m.colabora.texto[pg.idioma])} <a href="mailto:${m.colabora.correo}">${esc(m.colabora.correo)}</a></p>` : '';
    return `<main id="contenido" class="contenedor" data-estatico><h1>${esc(m.nombre)}</h1><p>${esc(m.rol[pg.idioma])}</p><p>${esc(m.bio[pg.idioma])}</p>${suyos ? `<ul>${suyos}</ul>` : ''}${productosSuyos ? `<h2>${esc(TITULO_PRODUCTOS[pg.idioma])}</h2><ul>${productosSuyos}</ul>` : ''}${colabora}<p><a href="${urlDe(pg.idioma, 'equipo')}">${esc(FIJAS.equipo[pg.idioma][0])}</a></p><ul>${enlaces}</ul></main>`;
  }
  // Portada: el bloque celeste con sus isobatas, como src/pages/Inicio.tsx, fuera de lo oculto (ver la ficha, abajo).
  if (pg.ruta === '') {
    return `<main id="contenido"><section class="hero" data-guion="cabecera" data-cabecera-estatica><img class="hero-fondo" src="${BASE_404}marca/isobatas.svg" alt="" aria-hidden="true" /><div class="contenedor" data-estatico><h1>${h1De(pg)}</h1><p>${esc(pg.descripcion)}</p><ul>${enlaces}</ul></div></section></main>`;
  }
  if (!p) return `<main id="contenido" class="contenedor" data-estatico><h1>${h1De(pg)}</h1><p>${esc(pg.descripcion)}</p><ul>${enlaces}</ul></main>`;
  const ext = p.enlaces.map((e) => `<li><a href="${e.url}">${esc(e.etiqueta[pg.idioma])}</a></li>`).join('');
  // Animaciones paso a paso: sin JS no hay dibujo, pero cada paso queda leído (título y narración) en una lista.
  const anim = (p.animaciones ?? []).map((a) => `<section><h2>${esc(a.titulo[pg.idioma])}</h2><ol>${a.pasos.map((x) => `<li><strong>${esc(x.titulo[pg.idioma])}</strong>: ${esc(x.narracion[pg.idioma])}</li>`).join('')}</ol></section>`).join('');
  // La imagen de la cabecera va FUERA de lo oculto (`data-estatico`) y con la misma estructura y clases que la de
  // src/pages/Proyecto.tsx: pinta sin esperar al JS y, al montar React, no se mueve ni se vuelve a bajar (mismo src/srcset).
  const modo = p.cabecera ?? 'ilustracion';
  const fondo = modo === 'color' ? PORTADA_ESTADO[p.estado] : undefined;
  const srcFondo = modo === 'ilustracion' ? p.portada.src : fondo;
  const ancho = modo === 'ilustracion' ? p.portada.ancho : ANCHO_ESTADO;
  const img = () => `<img class="proyecto-fondo" src="${BASE_404}${srcFondo}" srcset="${srcsetCabecera(srcFondo, ancho, (x) => BASE_404 + x)}" sizes="${SIZES_CABECERA}" alt="" fetchpriority="high" />`;
  // La portada va en un <picture> (con su recorte cuadrado para teléfonos si lo tiene), como en la app.
  const cuadrada = modo === 'ilustracion' && p.portada.cuadrada ? `<source media="${MEDIA_CUADRADA}" srcset="${BASE_404}${cuadradaDe(srcFondo)}" />` : '';
  const imgFondo = !srcFondo
    ? `<img class="proyecto-isobatas" src="${BASE_404}marca/isobatas.svg" alt="" aria-hidden="true" />`
    : modo === 'ilustracion' ? `<picture>${cuadrada}${img()}</picture>` : img();
  const acento = Object.entries(estiloAcento(p.acento)).map(([k, v]) => `${k}:${v}`).join(';');
  const cab = `<header data-guion="cabecera" data-cabecera-estatica class="proyecto-cabecera cabecera-${modo}${fondo ? ' cabecera-velada' : ''}">${imgFondo}<div class="contenedor proyecto-cabecera-contenido" data-estatico><div class="proyecto-cabecera-texto"><h1>${esc(p.nombre)}</h1><p class="proyecto-lema">${esc(p.lema[pg.idioma])}</p></div></div></header>`;
  return `<main id="contenido"><article class="proyecto" style="${acento}">${cab}<div class="contenedor proyecto-cuerpo" data-estatico><p>${esc(p.resumen[pg.idioma])}</p>${p.descripcion.map((d) => `<p>${esc(d[pg.idioma])}</p>`).join('')}<ul>${p.caracteristicas.map((c) => `<li><strong>${esc(c.titulo[pg.idioma])}</strong>: ${esc(c.texto[pg.idioma])}</li>`).join('')}</ul>${anim}${ext ? `<ul>${ext}</ul>` : ''}<p><a href="${urlDe(pg.idioma, '')}">Galivelop</a></p><ul>${enlaces}</ul></div></article></main>`;
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
  if (pg.ruta === 'productos') {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pg.titulo,
      description: pg.descripcion,
      url,
      inLanguage: pg.idioma,
      ...(pg.fecha ? { dateModified: pg.fecha } : {}),
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: productos.filter((x) => x.pagina).map((x, n) => ({ '@type': 'ListItem', position: n + 1, name: x.nombre, url: urlDe(pg.idioma, `productos/${x.slug}`) })),
      },
    };
  }
  if (pg.ruta === 'diario') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: pg.titulo,
      description: pg.descripcion,
      url,
      inLanguage: pg.idioma,
      ...(pg.fecha ? { dateModified: pg.fecha } : {}),
      publisher: ORG,
      blogPost: entradas.map((e) => ({ '@type': 'BlogPosting', headline: e.titulo[pg.idioma], url: urlDe(pg.idioma, `diario/${e.slug}`), datePublished: e.fecha })),
    };
  }
  const e = pg.entrada;
  if (e) {
    const autor = equipo.find((m) => m.id === e.autor);
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: e.titulo[pg.idioma],
      description: pg.descripcion,
      datePublished: e.fecha,
      ...(autor ? { author: { '@type': 'Person', name: autor.nombre, url: urlDe(pg.idioma, `equipo/${autor.id}`) } } : {}),
      inLanguage: pg.idioma,
      publisher: ORG,
      url,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      image: pg.imagen,
    };
  }
  const x = pg.producto;
  if (x) {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: x.nombre,
      ...(x.alias ? { alternateName: x.alias } : {}),
      description: pg.descripcion,
      url,
      image: pg.imagen,
      inLanguage: pg.idioma,
      dateModified: x.pagina.actualizado,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Linux',
      creator: ORG,
    };
  }
  if (!p) return { '@context': 'https://schema.org', '@graph': [ORG, { '@type': 'WebSite', name: 'Galivelop', url: urlDe(pg.idioma, ''), inLanguage: pg.idioma, publisher: { '@type': 'Organization', name: 'Galivelop', url: `${SITIO}/` } }] };
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

// ---------- Precargas ----------
// Lo que se ve primero (LCP) no espera al JavaScript: la imagen de cabecera de cada página, el trozo de JS de la página
// (y su ficha) van como <link rel=preload|modulepreload> en el HTML de cada página. Las fuentes no se precargan: medido
// (2026-11-17, móvil con 4G lento), compiten con el JS por el ancho de banda y retrasan el FCP y el LCP unos 100-150 ms.
const ACTIVOS = readdirSync('dist/assets');
const activo = (re) => ACTIVOS.find((f) => re.test(f));
// Qué chunk de src/paginas.ts lleva cada ruta: la misma tabla que la app (src/rutas.ts). Una página generada aquí que la
// app no conozca rompe el build: se quedaría sin precarga y la app pintaría «no encontrado».
const CHUNK_DE_RUTA = (ruta) => {
  const pagina = paginaDeSegmentos(ruta.split('/').filter(Boolean));
  if (pagina === 'NoEncontrado') throw new Error(`paginas-estaticas: la ruta «${ruta}» no tiene página en src/rutas.ts`);
  return pagina;
};
// Imagen de la cabecera de cada ficha, como src/pages/Proyecto.tsx: la portada (`ilustracion`), el fondo por estado
// (`color`) o las isobatas (`captura`).
const imagenLcp = (pg) => {
  if (pg.ruta === '') return 'marca/isobatas.svg';
  // La ilustración del formulario tiene versión clara y oscura (src/components/ImagenTema.tsx): el tema claro es el de por defecto.
  if (pg.ruta === 'participa/unirse') return 'marca/como-funciona.webp';
  if (pg.producto) return pg.producto.pagina.portada?.src;
  const p = pg.proyecto;
  if (!p) return undefined;
  const modo = p.cabecera ?? 'ilustracion';
  return modo === 'color' ? PORTADA_ESTADO[p.estado] : modo === 'captura' ? 'marca/isobatas.svg' : p.portada.src;
};
// `imagesrcset`/`imagesizes` de la precarga: los mismos que el `<img>` de la app, para que el navegador baje la misma
// versión (las portadas de ficha y las de estado, src/pages/Proyecto.tsx; la de producto, src/pages/Producto.tsx).
// Sin ellos, en /productos/galivelop-developer/ se precargaba el original (245 KB) y React pintaba la miniatura.
const versionesLcp = (pg, img) => {
  const enBase = (s) => BASE_404 + s;
  const portada = pg.producto?.pagina.portada;
  if (portada) return ` imagesrcset="${srcsetPortadaProducto(portada, enBase)}" imagesizes="${SIZES_PORTADA_PRODUCTO}"`;
  const p = pg.proyecto;
  if (!p) return '';
  const modo = p.cabecera ?? 'ilustracion';
  const ancho = modo === 'color' ? ANCHO_ESTADO : modo === 'ilustracion' ? p.portada.ancho : undefined;
  return ancho ? ` imagesrcset="${srcsetCabecera(img, ancho, enBase)}" imagesizes="${SIZES_CABECERA}"` : '';
};
// Los chunks que importa de forma estática el de la página (y los de esos), salvo los que ya precarga index.html, en las
// páginas cuyo LCP es texto pintado por React: sin ellos el navegador los descubre al analizar el de la página, en una
// segunda vuelta de red (medido 2026-11-27 en /equipo/, móvil con 4G lento: `IconoMarca`, `Retrato` e `iconos` llegaban
// después y el LCP esperaba). Los `import()` dinámicos no entran: se cargan cuando hacen falta.
const EN_INDEX = new Set([...base.matchAll(/assets\/([\w-]+\.js)/g)].map((m) => m[1]));
const importsDe = (archivo) =>
  [...readFileSync(`dist/assets/${archivo}`, 'utf8').matchAll(/(?:from|import)\s*["']\.\/([\w-]+\.js)["']/g)].map((m) => m[1]);
function cierreModulos(raices) {
  const vistos = new Set();
  const pila = [...raices];
  while (pila.length) {
    const m = pila.pop();
    if (vistos.has(m) || EN_INDEX.has(m)) continue;
    vistos.add(m);
    pila.push(...importsDe(m));
  }
  // Las raíces primero, en su orden; luego sus dependencias.
  return [...raices.filter((r) => vistos.has(r)), ...[...vistos].filter((m) => !raices.includes(m)).sort()];
}
function precargas(pg) {
  const lineas = [];
  const img = imagenLcp(pg);
  // Con recorte cuadrado, dos precargas que se excluyen por `media`, las mismas condiciones que el <picture>: cada
  // pantalla baja solo la que va a pintar.
  const cuadrada = pg.proyecto && (pg.proyecto.cabecera ?? 'ilustracion') === 'ilustracion' && pg.proyecto.portada.cuadrada;
  if (cuadrada) lineas.push(`<link rel="preload" as="image" href="${BASE_404}${cuadradaDe(img)}" media="${MEDIA_CUADRADA}" fetchpriority="high" />`);
  if (img) lineas.push(`<link rel="preload" as="image" href="${BASE_404}${img}"${versionesLcp(pg, img)}${cuadrada ? ` media="not all and ${MEDIA_CUADRADA}"` : ''} fetchpriority="high" />`);
  const raices = [CHUNK_DE_RUTA(pg.ruta), pg.proyecto?.slug].filter(Boolean).map((n) => activo(new RegExp(`^${n}-[\\w-]{8}\\.js$`)));
  // Con imagen LCP precargada, solo los chunks de la página: más JS a la vez le quita ancho de banda a la imagen (medido
  // 2026-11-27: la ficha de image-generator pasaba de 2,97 a 3,5 s con el cierre entero).
  const modulos = img ? raices.filter(Boolean) : cierreModulos(raices.filter(Boolean));
  for (const m of modulos) lineas.push(`<link rel="modulepreload" crossorigin href="${BASE_404}assets/${m}" />`);
  return lineas.join('\n    ');
}

for (const pg of paginas) {
  const url = urlDe(pg.idioma, pg.ruta);
  const alternas = [
    ...IDIOMAS.map((i) => `<link rel="alternate" hreflang="${i}" href="${urlDe(i, pg.ruta)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${urlDe('es', pg.ruta)}" />`,
    `<link rel="alternate" type="application/atom+xml" title="${esc(FIJAS.novedades[pg.idioma][0])}" href="${feedDe(pg.idioma)}" />`,
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
    .replace(/(property="og:type" content=")[^"]*/, `$1${pg.entrada ? 'article' : 'website'}`)
    .replace(/(property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(property="og:title" content=")[^"]*/, `$1${esc(pg.titulo)}`)
    .replace(/(name="twitter:title" content=")[^"]*/, `$1${esc(pg.titulo)}`);
  for (const k of ['name="description"', 'property="og:description"', 'name="twitter:description"']) {
    html = html.replace(new RegExp(`(${k} content=")[^"]*`), `$1${esc(pg.descripcion)}`);
  }
  html = conImagen(html, pg.imagen, pg.vista?.alt ?? ALT_PORTAL[pg.idioma]);
  if (pg.vista && !pg.vista.medidas) html = html.replace(/\s*<meta property="og:image:(width|height|type)"[^>]*>/g, '');
  html = html
    .replace('</head>', `  ${precargas(pg)}\n    ${ESTILO_ESTATICO}\n  <script type="application/ld+json">${JSON.stringify(datos(pg, url)).replace(/</g, '\\u003c')}</script>\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${cabecera(pg.idioma, pg.ruta)}${cuerpo(pg)}${pie(pg.idioma)}</div>`);
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
    .join('\n')}\n\n## Productos\n\n${productos
    .filter((x) => x.pagina)
    .map((x) => `- [${x.nombre}](${urlDe('es', `productos/${x.slug}`)}): ${x.pagina.seo.descripcion.es}`)
    .join('\n')}\n\n## Diario\n\n${entradas
    .map((e) => `- [${e.titulo.es}](${urlDe('es', `diario/${e.slug}`)}): ${e.descripcion.es}`)
    .join('\n')}\n\n## Más\n\n${hayMuro ? `- [Muro](${urlDe('es', 'muro')}): publicaciones de los proyectos\n` : ''}- [Novedades](${urlDe('es', 'novedades')}): lo último de cada proyecto\n- [Productos](${urlDe('es', 'productos')}): lo que hacen por su cuenta quienes forman el taller, sin precios\n- [Equipo](${urlDe('es', 'equipo')}): las personas y, en su perfil, los productos que lleva cada una (Galivelop Developer y Galivelop Evaluator, privados, sin precios)\n- [Únete al taller](${urlDe('es', 'participa/unirse')})\n- [Propón un proyecto](${urlDe('es', 'participa/proponer')})\n- Versiones: [galego](${urlDe('gl', '')}), [English](${urlDe('en', '')})\n`,
);
// Feed Atom de /novedades por idioma, con lo mismo que la página y en su orden. Los `id` son URI `tag:` que no
// dependen de la dirección del sitio (no cambian con un dominio propio) ni del orden: salen del contenido de cada
// novedad (scripts/id-feed.mjs). Corregir el texto en castellano de una novedad le cambia el id.
const ID_FEED = 'tag:zeldris.github.io,2026:novedades';
const idsFeed = idsDelFeed(novedadesTodas);
for (const i of IDIOMAS) {
  const nombre = (slug) => proyectos.find((x) => x.slug === slug)?.nombre ?? slug;
  const entradasFeed = novedadesTodas.map((x, n) => {
    const enlace = x.muro && hayMuro ? `${urlDe(i, 'muro')}?proyecto=${x.proyecto}` : urlDe(i, `proyectos/${x.proyecto}`);
    const titulo = `${nombre(x.proyecto)} · ${x.titulo ? x.titulo[i] : recorta(x.texto[i], 90)}`;
    return `  <entry>\n    <title>${esc(titulo)}</title>\n    <id>${ID_FEED}/${i}/${idsFeed[n]}</id>\n    <link rel="alternate" type="text/html" href="${esc(enlace)}" />\n    <updated>${x.fecha}T00:00:00Z</updated>\n    <summary>${esc(x.texto[i])}</summary>\n  </entry>\n`;
  });
  const [titulo, descripcion] = FIJAS.novedades[i];
  mkdirSync(`dist/${prefijo(i)}novedades`, { recursive: true });
  writeFileSync(
    `dist/${prefijo(i)}novedades/feed.xml`,
    `<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${i}">\n  <title>${esc(titulo)}</title>\n  <subtitle>${esc(descripcion)}</subtitle>\n  <id>${ID_FEED}/${i}</id>\n  <link rel="self" type="application/atom+xml" href="${feedDe(i)}" />\n  <link rel="alternate" type="text/html" hreflang="${i}" href="${urlDe(i, 'novedades')}" />\n  <updated>${FECHA_FIJA.novedades}T00:00:00Z</updated>\n  <author>\n    <name>Galivelop</name>\n    <uri>${SITIO}/</uri>\n  </author>\n${entradasFeed.join('')}</feed>\n`,
  );
}
writeFileSync(`dist/${INDEXNOW_CLAVE}.txt`, INDEXNOW_CLAVE);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITIO}/sitemap.xml\n`);
console.log(`Páginas estáticas: ${paginas.length}, sitemap.xml, robots.txt, llms.txt y feed de novedades (${IDIOMAS.length} idiomas)`);
