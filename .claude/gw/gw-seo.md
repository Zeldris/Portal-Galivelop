# Nota del portal para gw-seo

Build command: npm run build
Build dir: dist
Languages: es, gl, en
Generator: scripts/paginas-estaticas.mjs (cabeceras, JSON-LD, sitemap.xml, robots.txt y llms.txt); la dirección del portal y la clave de IndexNow, en scripts/sitio.mjs; la vista previa de cada proyecto, con tools/og/generar.py
Rules: «Rutas y SEO» de REVIEW.md; «SEO» de docs/desarrollo.md; fuentes en docs/investigacion/seo-indexacion-previews.md

- El check se corre con `npm run seo` (después de `npm run build`).
- Lo que ya hace el portal y no hay que proponer de nuevo: `lastmod` por fecha real (git o `actualizado`), IndexNow en
  `pages.yml`, `og.jpg` 1200×630 por proyecto, `og:locale` por idioma, `llms.txt`.
- Pendiente de la persona: la política de rastreadores de IA en `robots.txt` (hoy `Allow: /` para todos).
