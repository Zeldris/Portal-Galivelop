// Comprueba que lo que sirve el servidor para una ruta es su página estática (la de scripts/paginas-estaticas.mjs) y
// no la de otra ruta: sin barra final, `vite preview` devuelve la portada y las cifras saldrían de otra página.
// `data-estatico` solo dice que es una página generada (el pie lo trae en todas, también la portada); lo que distingue
// la ruta es el `canonical`. Solo para rutas de página (no `404.html`). Hoy lo usa `auditar-rendimiento.cjs`.

/** `equipo`, `/equipo` o `equipo/` → `equipo/`; la portada se queda en `''`. */
function normalizarRuta(ruta) {
  const limpia = ruta.replace(/^\/+|\/+$/g, '');
  return limpia ? `${limpia}/` : '';
}

/** Motivo por el que `html` no es la página estática de `ruta` (ya normalizada), o `null` si lo es. */
function motivoNoEstatica(html, ruta) {
  if (!/\sdata-estatico[\s>=]/.test(html))
    return `/${ruta}: the HTML has no data-estatico (not a static page; was dist/ built with npm run build?)`;
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (!canonical) return `/${ruta}: the HTML has no canonical link`;
  const esperado = `/Portal-Galivelop/${ruta}`;
  if (!canonical.endsWith(esperado))
    return `/${ruta}: the server returned the page of ${canonical} (expected one ending in ${esperado})`;
  return null;
}

module.exports = { normalizarRuta, motivoNoEstatica };
