// Comprueba que lo que sirve el servidor para una ruta es su página estática (la de scripts/paginas-estaticas.mjs) y
// no la de otra ruta: sin barra final, `vite preview` devuelve la portada y las cifras saldrían de otra página.
// `data-estatico` solo dice que es una página generada (el pie lo trae en todas, también la portada); lo que distingue
// la ruta es el `canonical`. Solo para rutas de página (no `404.html`). También reúne lo puro que comparten los
// scripts de tools/qa (barra de BASE, rutas del sitemap, CSS enlazados, qué se prueba), para poder probarlo sin navegador.
// Lo usan auditar-rendimiento, auditar-accesibilidad, medir-paginas, capturas y probar-lector.

const BASE_POR_DEFECTO = '/Portal-Galivelop/';

/** `equipo`, `/equipo` o `equipo/` → `equipo/`; la portada se queda en `''` y un archivo (`404.html`) sin barra. */
function normalizarRuta(ruta) {
  const limpia = ruta.replace(/^\/+|\/+$/g, '');
  if (!limpia) return '';
  return /\.[A-Za-z0-9]+$/.test(limpia) ? limpia : `${limpia}/`;
}

/** `BASE` siempre con una sola barra final, para que `BASE + ruta` no pegue el último tramo con la ruta. */
function normalizarBase(base) {
  return base.replace(/\/*$/, '/');
}

/** Ruta (con barras a los dos lados) en la que cuelga `base`: `http://localhost:4175/x` → `/x/`. */
function rutaDeBase(base) {
  return normalizarBase(new URL(base).pathname);
}

/** Rutas de página de un sitemap, sin origen ni la ruta de `base`; la portada es `''`. */
function rutasDelSitemap(xml, base) {
  const raiz = rutaDeBase(base);
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => {
    const ruta = new URL(m[1]).pathname;
    return ruta.startsWith(raiz) ? ruta.slice(raiz.length) : ruta.replace(/^\//, '');
  });
}

/** `href` de la etiqueta `<link rel="canonical">`, con `rel` y `href` en cualquier orden; `undefined` si no hay. */
function canonicalDe(html) {
  for (const [etiqueta] of html.matchAll(/<link\b[^>]*>/gi)) {
    if (!/\brel\s*=\s*["']?canonical\b/i.test(etiqueta)) continue;
    const href = etiqueta.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    if (href) return href[1] ?? href[2];
  }
  return undefined;
}

/**
 * Motivo por el que `html` no es la página estática de `ruta` (ya normalizada), o `null` si lo es. `base` es la URL
 * del servidor: su ruta (`/Portal-Galivelop/`) es la que debe llevar el canonical.
 */
function motivoNoEstatica(html, ruta, base = BASE_POR_DEFECTO) {
  if (!/\sdata-estatico[\s>=]/.test(html))
    return `/${ruta}: the HTML has no data-estatico (not a static page; was dist/ built with npm run build?)`;
  const canonical = canonicalDe(html);
  if (!canonical) return `/${ruta}: the HTML has no canonical link`;
  const esperado = (/^https?:/.test(base) ? rutaDeBase(base) : normalizarBase(base)) + ruta;
  if (!canonical.endsWith(esperado))
    return `/${ruta}: the server returned the page of ${canonical} (expected one ending in ${esperado})`;
  return null;
}

/** Hojas de estilo enlazadas en un HTML, como nombres de archivo de `assets/`. */
function cssEnlazados(html) {
  return [...html.matchAll(/<link\b[^>]*\bhref\s*=\s*"[^"]*\/assets\/([^"]+\.css)"[^>]*>/gi)].map((m) => m[1]);
}

/** Cuenta las `@font-face` de varios CSS y reúne sus `font-display` (todas las hojas, no solo la primera). */
function resumenFuentes(textosCss) {
  const todo = textosCss.join('\n');
  return {
    fontFace: (todo.match(/@font-face/g) || []).length,
    fontDisplay: [...new Set(todo.match(/font-display:[a-z]+/g))],
  };
}

/** Los ficheros de `src/` (no de tests) son los únicos donde se buscan además depuración y TODO. */
function esCodigoDeSrc(fichero) {
  return /\/src\//.test(fichero) && !/\.test\./.test(fichero);
}

/** Mensaje de error si no hay nada que probar (para no salir en verde con 0 casos), o `null`. */
function motivoSinCasos(elegidos, pedidas) {
  if (elegidos.length) return null;
  return pedidas.length
    ? `no hay ningún guion con audio en castellano para: ${pedidas.join(', ')}; no se ha probado nada`
    : 'no hay ningún guion con audio en castellano en src/data/guiones; no se ha probado nada';
}

module.exports = {
  normalizarRuta,
  normalizarBase,
  rutaDeBase,
  rutasDelSitemap,
  canonicalDe,
  motivoNoEstatica,
  cssEnlazados,
  resumenFuentes,
  esCodigoDeSrc,
  motivoSinCasos,
};
