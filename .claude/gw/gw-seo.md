# Nota del portal para gw-seo

Build command: npm run build
Build dir: dist
Languages: es, gl, en
Generator: scripts/paginas-estaticas.mjs (cabeceras, JSON-LD, sitemap.xml, robots.txt y llms.txt); la dirección del portal y la clave de IndexNow, en scripts/sitio.mjs; la vista previa de cada proyecto, con tools/og/generar.py
Rules: «Rutas y SEO» de REVIEW.md; «SEO» de docs/desarrollo.md; fuentes en docs/investigacion/seo-indexacion-previews.md

- El check se corre con `npm run seo` (después de `npm run build`).
- Lo que ya hace el portal y no hay que proponer de nuevo: `lastmod` por fecha real (git o `actualizado`), IndexNow en
  `pages.yml`, `og.jpg` 1200×630 por proyecto, `og:locale` por idioma, `llms.txt`, imagen y texto alternativo de la
  vista previa en el idioma de cada página (`og-gl.jpg`/`og-en.jpg`, `galivelop-portal-gl.jpg`/`-en.jpg`, desde
  2026-11-10) y tarjeta del destino en las páginas de paso (`/productos/`).
- Avisos aceptados (2026-11-10): en las páginas de paso `productos/` (es, gl, en), `canonical-not-self`, `h1-missing`,
  `duplicate-title` y `duplicate-description` con `equipo/`: es una redirección con `noindex` y la canónica en el destino.
- Avisos aceptados (2026-11-05): `parity-same-title` en aviso-legal, equipo y los dos perfiles, es y gl. En gallego
  «Aviso legal» y «Equipo» se escriben igual, y los nombres no se traducen.
- Pendiente de la persona: la política de rastreadores de IA en `robots.txt` (hoy `Allow: /` para todos).
