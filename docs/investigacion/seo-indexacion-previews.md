# SEO, indexación al día y vistas previas de enlaces

Consulta: 2026-10-30. Pregunta: qué puede hacer el portal (código, workflow, gestión a mano) para posicionar mejor, para
que los buscadores tengan siempre lo más reciente y para que las vistas previas de enlaces (Open Graph y X Cards) se vean
bien y se refresquen, sin romper rutas ya indexadas.

## Límite de la consulta

- **Leído directamente** (WebFetch o curl): `developers.google.com/search/...`, `indexnow.org`, `ogp.me`, `docs.github.com`,
  `developers.facebook.com`, `support.claude.com`, `developers.openai.com`, `llmstxt.org`, `w3.org/TR/websub`, y el portal en
  vivo (`curl`, cabeceras y HTML).
- **No se pudo leer directamente:** `developer.x.com` (HTTP 402; las cifras de X salen de un resultado de búsqueda que cita
  esa página); `linkedin.com/help` (la página que abrió no trataba Post Inspector; la caché de ~7 días es de blogs de terceros,
  **sin verificar**); `bing.com/webmasters/help/...` (404) y `learn.microsoft.com` (no trató la importación; la importación desde
  Search Console sale del blog oficial de Bing vía búsqueda); `web.dev` (HTTP 500; se usó la página de Google Search sobre Core
  Web Vitals); Discord, WhatsApp y Telegram **no tienen documentación oficial de caché**: lo anotado es de guías de terceros,
  marcado «sin verificar». El post de 2023 del ping de sitemaps se leyó solo por resultado de búsqueda (el texto devuelto era el
  índice del blog); la fecha (26 jun 2023) y el contenido vienen de ese resultado.
- La caché de 15 minutos de WebFetch y los resúmenes de un modelo pequeño pueden omitir matices: las citas textuales de abajo
  son las que devolvió la herramienta.

## Estado actual del portal (comprobado en `scripts/paginas-estaticas.mjs` y en la web viva)

Ya está bien: una página HTML real por ruta e idioma con título, descripción, canónica, `hreflang` es/gl/en + `x-default`
(autorreferenciado y recíproco), Open Graph y Twitter Card, JSON-LD, cuerpo para quien no ejecuta JS; `sitemap.xml`,
`robots.txt` con `Sitemap:`, `llms.txt`; imagen de la vista previa con `?v=<hash>`; HTTP 404 real para rutas inexistentes
(comprobado: `/nada-xyz` devuelve 404); verificación de Search Console. La portada lleva `og:image` 1200×630 JPG (110 KB).

Huecos confirmados:
1. `sitemap.xml` en vivo: las páginas fijas (portada, equipo, productos, participa, miembros) llevan `lastmod` = fecha del build
   (hoy 2026-10-29, línea 199 y 203 del script); los proyectos usan `actualizado`. Cada despliegue cambia todas las fechas fijas.
2. Sin `og:locale` ni `og:locale:alternate`.
3. Sin `rel="alternate"` a ningún feed; el muro (`src/data/muro/`) hoy solo tiene `LEEME.md`, así que no hay publicaciones ni
   página `/muro` todavía.
4. Las páginas de proyecto usan `portada.webp` como `og:image` (comprobado en `/proyectos/tarkor/`), sin `og:image:width/height`.
5. Miembros y páginas fijas, en los tres idiomas, usan la misma imagen de marca.
6. Sin IndexNow, sin Bing Webmaster Tools, sin dominio propio; `robots.txt` no distingue rastreadores de IA.

## Hallazgos

### 1. Google: rastreo, sitemaps, estructurados

- **JS y prerender.** Google procesa las apps JS en tres fases (rastreo, renderizado, indexación); el renderizado puede esperar
  «a few seconds, but it can take longer». Aun así recomienda SSR/prerender porque «not all bots can run JavaScript». Solo sigue
  enlaces `<a href>`; no usar fragmentos. En SPAs, un error debe devolver 404 real o `noindex`. El portal ya cumple (páginas
  estáticas + 404). <https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics>
- **`lastmod`.** Google lo usa «if it's consistently and verifiably» exacto, y debe reflejar «the last significant update»
  (contenido principal, datos estructurados o enlaces; no un año de copyright). Un `lastmod` que cambia en cada build sin cambio
  real es justo lo no fiable; omitirlo donde no se conoce es aceptable. `changefreq` y `priority` no se usan.
  <https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap> y
  <https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping> (leído vía búsqueda).
- **Ping de sitemaps.** Retirado: anunciado el 26-jun-2023, el endpoint devuelve 404; se envía por Search Console o `Sitemap:` en
  `robots.txt` (misma fuente). **No hay forma de «avisar» a Google tras cada despliegue** salvo `lastmod` fiable. La guía de
  sitemaps menciona WebSub solo para feeds Atom/RSS: «you can use WebSub to broadcast your changes to search engines».
- **Inspección de URL.** Permite pedir indexación de una URL, con cupo diario por propiedad; «Submitting a request does not
  guarantee…»; para muchas páginas nuevas o cambiadas recomienda un sitemap con `lastmod`.
  <https://support.google.com/webmasters/answer/9012289>
- **hreflang.** Cada versión debe listarse a sí misma y a las demás; si no son recíprocas «the tags will be ignored»; URLs
  absolutas; `x-default` para quien no encaja en ninguna; HTML, cabecera o sitemap son equivalentes (elegir uno). El portal lo
  cumple. <https://developers.google.com/search/docs/specialty/international/localized-versions>
- **Canónicas.** `rel=canonical` es señal fuerte; sitemap, débil; no mezclar URLs distintas entre métodos; recomendada la
  autorreferencia. El portal lo cumple. <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>
- **Datos estructurados vigentes** (galería): Article, Breadcrumb, Organization, Profile page, Software app, entre otros.
  <https://developers.google.com/search/docs/appearance/structured-data/search-gallery>
  - **FAQ: retirado.** La página de FAQ indica que dejó de mostrarse el 7-may-2026 y retiró la documentación en jun-2026
    (antes, desde sep-2023, solo sitios autoritativos de gobierno y salud). **No añadir FAQ.**
    <https://developers.google.com/search/docs/appearance/structured-data/faqpage>
  - **Software app:** exige `offers.price` (0 si es gratis) y `aggregateRating` o `review`; «Google doesn't show a rich result
    for Software Apps that only have the VideoGame type» (añadir un segundo tipo como `MobileApplication`/`WebApplication`).
    Sin valoraciones reales no hay resultado enriquecido; no inventar reseñas.
    <https://developers.google.com/search/docs/appearance/structured-data/software-app>
  - **Profile page:** válida para «About Me» y páginas de empleado; requiere `mainEntity` Person/Organization con `name`;
    recomendados `dateCreated`/`dateModified`, `sameAs`, `image`.
    <https://developers.google.com/search/docs/appearance/structured-data/profile-page>
  - **Organization:** sin propiedades obligatorias; `logo` ≥112×112; el `name` debe coincidir con el nombre del sitio; basta
    en la portada o en una página «Sobre».
    <https://developers.google.com/search/docs/appearance/structured-data/organization>
  - **Article/BlogPosting:** sin propiedades obligatorias; ayuda a entender título, imagen y fecha, no garantiza función
    enriquecida. Solo tiene sentido cuando existan publicaciones con página propia.
    <https://developers.google.com/search/docs/appearance/structured-data/article>
  - **Nombre del sitio (WebSite):** debe estar en la portada de un dominio o subdominio; «Google Search does not support site
    names at the subdirectory level». No dice si un `usuario.github.io` se trata distinto; probar con Search Console.
    <https://developers.google.com/search/docs/appearance/site-names>
- **Core Web Vitals.** Google «highly recommend[s]» buenos CWV: LCP ≤2,5 s, INP <200 ms, CLS <0,1; no cuantifica el efecto en
  el ranking. Informe en Search Console. <https://developers.google.com/search/docs/appearance/core-web-vitals>

### 2. Bing e IndexNow

- Protocolo: archivo `{clave}.txt` en la raíz con la clave (8-128 caracteres), petición a `/indexnow` o POST con hasta 10 000
  URLs; los motores adheridos comparten lo enviado entre sí; un 200 solo confirma recepción.
  <https://www.indexnow.org/documentation>
- Motores listados: Bing, Yandex, Seznam, Naver, Yep, Internet Archive, Amazonbot. **Google no figura.**
  <https://www.indexnow.org/searchengines.json> (Google «probó» el protocolo en 2021 según prensa; sin respaldo oficial
  actual: sin verificar).
- En GitHub Pages es viable: el archivo de clave se genera en `dist/` durante el build y el envío es un paso del workflow tras
  `deploy-pages`. Hay acciones de terceros (p. ej. `bojieyang/indexnow-action`) cuyo README avisa de generar el archivo en el
  despliegue; la clave es pública por diseño. Comprobar versiones antes de usarlas, o un `curl` propio sin dependencia.
  <https://github.com/bojieyang/indexnow-action>
- Bing Webmaster Tools permite importar sitios y sitemaps desde Search Console y revalida la propiedad sincronizando con ella.
  <https://blogs.bing.com/webmaster/september-2019/Import-sites-from-Search-Console-to-Bing-Webmaster-Tools> (leído vía búsqueda).

### 3. GitHub Pages

- Sitio ≤1 GB, ancho de banda blando 100 GB/mes, despliegue con tiempo máximo de 10 min; la página de límites no trata SEO ni
  caché. <https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits>
- **Caché medida en vivo (curl, 2026-10-30):** `cache-control: max-age=600` en HTML y `last-modified` del despliegue; no se
  pueden poner cabeceras propias (solo foros: sin verificar). Un despliegue tarda hasta ~10 min en verse en todo el mundo.
- Dominio propio: GitHub recomienda `www` (con apex redirigiendo), verificar el dominio contra tomas, HTTPS con Let's Encrypt
  automático. La documentación leída **no dice** que `github.io` redirija al dominio propio; hay que comprobarlo tras el cambio.
  <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages>,
  <https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https>
- Nada bloquea la indexación: la web responde 200 y el `robots.txt` permite todo. No encontré fuente primaria que compare
  `github.io` con dominio propio en SEO; el beneficio claro y comprobable es la **estabilidad de URL** (migrar de dominio obliga a
  redirecciones que Pages no permite configurar desde el servidor) y el nombre de sitio.

### 4. Vistas previas

- **Open Graph:** `og:locale` (por defecto `en_US`, formato `es_ES`), `og:locale:alternate` repetible; `og:image:width/height`
  y `og:image:alt` (recomendada si hay imagen). <https://ogp.me/>
- **Facebook:** formatos JPEG, GIF o PNG para `og:image:type`; la imagen se cachea por URL («won't be updated unless the URL
  changes»); el Sharing Debugger fuerza un nuevo rastreo; rastreador `facebookexternalhit/1.1`; indicar ancho y alto para que
  cargue a la primera. <https://developers.facebook.com/docs/sharing/webmasters>
- **X:** `summary_large_image` con proporción 2:1, mínimo 300×157, máximo 4096×4096, <5 MB; JPG, PNG, WEBP y GIF (cita vía
  búsqueda de `developer.x.com`, página no abierta). 1200×630 es válido en la práctica; la caché se renueva con el validador
  (tercero, sin verificar).
- **LinkedIn:** compartir exige ≥1200×627 recomendado 1,91:1, ≤5 MB; <401 px de ancho sale como miniatura.
  <https://www.linkedin.com/help/linkedin/answer/a521928>. Post Inspector fuerza el refresco; caché de ~7 días (terceros, sin
  verificar).
- **Discord, WhatsApp, Telegram:** sin documentación oficial. Guías de terceros (sin verificar): Discord cachea por URL y se
  refresca cambiando la URL o su query; WhatsApp no tiene depurador y el truco es `?v=`; Telegram: enviar los enlaces a
  `@WebpageBot` (`/updatepreview`, hasta 10) y avisan de que a veces confirma sin cambiar nada.
- **Consecuencia práctica:** la regla `?v=<hash>` solo en la **imagen** refresca la imagen cuando cambia, no el texto de una
  tarjeta ya cacheada, y no ayuda a quien ya compartió la URL de página. Solo se reaprende al cambiar la URL compartida o al
  forzar el rastreo a mano.

### 5. Feeds, descubrimiento, IA

- **WebSub** es una especificación de W3C: el editor declara un `hub` y un `self` (cabecera `Link` o `<link>` en el feed).
  <https://www.w3.org/TR/websub/>. Google la nombra como vía para feeds Atom/RSS. Sin un hub público no hay a quién avisar;
  su valor para este portal es bajo mientras no haya muro con ritmo propio.
- **`llms.txt`:** sigue siendo una «proposal»; la página no dice que ningún proveedor se comprometa a leerlo.
  <https://llmstxt.org/>. Prensa citando a Mueller: Google no lo usa para Búsqueda ni AI Overviews (secundaria, sin
  verificar). Coste casi nulo; no cabe esperar posicionamiento.
- **Rastreadores de IA y `robots.txt`:**
  - Google: `Google-Extended` es solo un token (sin rastreador propio); «does not impact a site's inclusion in Google Search»
    ni es señal de ranking; controla el uso para entrenar Gemini y el grounding.
    <https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers>
  - OpenAI: `OAI-SearchBot` (búsqueda de ChatGPT), `GPTBot` (entrenamiento), `ChatGPT-User` (a petición del usuario; robots.txt
    puede no aplicar). <https://developers.openai.com/api/docs/bots>
  - Anthropic: `ClaudeBot` (entrenamiento), `Claude-User` (consulta del usuario), `Claude-SearchBot` (búsqueda); todos
    respetan `robots.txt`. <https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler>
  - El `Allow: /` actual los permite a todos. Decisión de política de la persona (bloquear entrenamiento y dejar búsqueda es
    una posible mezcla); no afecta a Google Search.

## Recomendaciones priorizadas

«Código» = lo hace un script o workflow; «A mano» = la persona. **R** marca lo que toca `scripts/paginas-estaticas.mjs`,
rutas indexadas o el flujo de despliegue (riesgo).

| # | Qué | Por qué | Esfuerzo | Riesgo | Archivo |
|---|---|---|---|---|---|
| 1 | **A mano:** dar de alta el sitio en Search Console (ya verificado), enviar `sitemap.xml`, mirar informe de páginas e inspeccionar la portada y las fichas nuevas tras cada publicación importante | Es la única vía directa a Google tras retirar el ping | Bajo | Ninguno | (fuera del repo) |
| 2 | **Código:** `lastmod` honesto en páginas fijas: derivarlo de la última fecha de los datos que muestran (p. ej. `actualizado` máx. de proyectos para portada/productos; fecha del archivo de equipo o de `git log` para equipo/participa), y **omitirlo** si no se sabe, en lugar de la fecha del build | Google ignora `lastmod` si no es verificable; hoy cambia todo en cada despliegue | Bajo-medio | **R** (script) pero no cambia URLs | `scripts/paginas-estaticas.mjs` líneas 199-203 |
| 3 | **Código:** paso IndexNow en `pages.yml` tras `deploy-pages` (clave en secreto, `dist/<clave>.txt` generado en el build, POST con las URLs cuyo `lastmod` cambió o todas) | Bing, Yandex, Seznam, Naver, Yep, Archive y Amazonbot se enteran en el acto; Google no | Medio | **R** (workflow y script) | `.github/workflows/pages.yml`, `scripts/paginas-estaticas.mjs` |
| 4 | **A mano:** Bing Webmaster Tools importando el sitio desde Search Console, y enviar el sitemap | Cubre Bing/DuckDuckGo y da el informe de rastreo | Bajo | Ninguno | (fuera del repo) |
| 5 | **Código:** `og:locale` (`es_ES`, `gl_ES`, `en_US`) y `og:locale:alternate` de los otros dos en cada página | Define el idioma de la tarjeta; hoy es `en_US` por defecto | Bajo | **R** (script) | `scripts/paginas-estaticas.mjs`, `index.html` |
| 6 | **Código:** `og:image:type` y `og:image:width/height` también en proyectos, y una versión JPG o PNG de 1200×630 de cada portada para la vista previa (hoy WebP, que Facebook no lista entre sus formatos) | Facebook documenta JPEG/GIF/PNG y pide dimensiones para cargar a la primera; ya se quitan al ser WebP | Medio (generar imágenes) | **R** (script y `public/`) | `scripts/paginas-estaticas.mjs` línea 187, `public/proyectos/*` |
| 7 | **Código:** una imagen de vista previa propia por miembro y por página fija, y variantes por idioma si el texto va dentro | Hoy todas comparten la de marca; solo mejora el clic, no el ranking | Medio-alto | Bajo | `scripts/paginas-estaticas.mjs`, `public/marca/` |
| 8 | **Código:** añadir `dateModified` a ProfilePage de miembros y `sameAs` real; si un proyecto tuviera valoraciones reales, `aggregateRating` y `offers.price: 0` | Requisitos de Google para ProfilePage/Software app; sin valoraciones, no hay rich result | Bajo | **R** (script) | `scripts/paginas-estaticas.mjs`, función `datos` |
| 9 | **Código (cuando haya publicaciones):** página por pieza del muro con `BlogPosting`, y feed Atom/RSS con `<link rel="alternate" type="application/atom+xml">` | Descubrimiento y enlaces a una URL propia por pieza; sin ellas el muro es una sola página | Alto | **Alto**: rutas nuevas indexables | `scripts/paginas-estaticas.mjs`, rutas de la SPA |
| 10 | **A mano:** decidir dominio propio (con `www`, verificar dominio, HTTPS) **antes** de que haya muchas URLs compartidas | Una URL estable propia mejora el nombre de sitio y evita migrar luego; Pages no permite redirecciones de servidor | Medio | **Alto**: cambia todas las URL (canónicas, hreflang, sitemap, OG) | `SITIO` en el script, `CNAME`, DNS, Search Console («Cambio de dirección», sin verificar) |
| 11 | **Código:** `robots.txt` con política explícita por rastreador de IA (decide la persona) | `Allow: /` permite entrenamiento; la búsqueda de IA conviene mantenerla | Bajo | **R** (script) | `scripts/paginas-estaticas.mjs` línea 212 |
| 12 | **A mano:** tras un cambio de texto o imagen, refrescar tarjetas: Sharing Debugger (Facebook, y de rebote WhatsApp según terceros), Post Inspector (LinkedIn), validador de X, `@WebpageBot` (Telegram), y para Discord compartir con `?v=` nuevo | No hay otra vía oficial; las ya publicadas pueden seguir viejas | Bajo | Ninguno | (fuera del repo) |
| 13 | **Código:** medir CWV (informe de Search Console y Lighthouse) y vigilar el LCP de la portada, la imagen mayor | Google lo recomienda, sin cuantificar; el portal es estático y probablemente ya cumple (sin medir aquí) | Bajo | Ninguno | — |
| – | No hacer: FAQ (retirado), ping de sitemap (404), `changefreq`/`priority` (ignorados), esperar mejoras de ranking por `llms.txt` | Fuentes arriba | — | — | — |

Orden sugerido: 1, 4 y 12 (a mano, hoy); 2, 5, 3 (código, un PR pequeño con `/code-review`); 6 y 8 después; 10 y 9 como
decisiones de producto.

## Fuentes (consultadas el 2026-10-30)

- <https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics>
- <https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap>
- <https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping> (por búsqueda)
- <https://support.google.com/webmasters/answer/9012289>
- <https://developers.google.com/search/docs/specialty/international/localized-versions>
- <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>
- <https://developers.google.com/search/docs/appearance/structured-data/search-gallery>
- <https://developers.google.com/search/docs/appearance/structured-data/faqpage>
- <https://developers.google.com/search/docs/appearance/structured-data/software-app>
- <https://developers.google.com/search/docs/appearance/structured-data/profile-page>
- <https://developers.google.com/search/docs/appearance/structured-data/organization>
- <https://developers.google.com/search/docs/appearance/structured-data/article>
- <https://developers.google.com/search/docs/appearance/site-names>
- <https://developers.google.com/search/docs/appearance/core-web-vitals>
- <https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers>
- <https://www.indexnow.org/documentation> y <https://www.indexnow.org/searchengines.json>
- <https://github.com/bojieyang/indexnow-action> (por búsqueda)
- <https://blogs.bing.com/webmaster/september-2019/Import-sites-from-Search-Console-to-Bing-Webmaster-Tools> (por búsqueda)
- <https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits>
- <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages>
- <https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https>
- <https://ogp.me/>
- <https://developers.facebook.com/docs/sharing/webmasters>
- <https://www.linkedin.com/help/linkedin/answer/a521928>
- <https://developer.x.com/en/docs/x-for-websites/cards/overview/summary-card-with-large-image> (solo por búsqueda; 402 al abrir)
- <https://www.w3.org/TR/websub/>
- <https://llmstxt.org/>
- <https://developers.openai.com/api/docs/bots>
- <https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler>
- Terceros sin verificar (solo para Discord, WhatsApp, Telegram, LinkedIn y llms.txt): resultados de búsqueda del 2026-10-30
  (israynotarray.com, solomono.net, bugs.telegram.org, seroundtable.com, searchenginejournal.com).
- Medición propia: `curl -I https://zeldris.github.io/Portal-Galivelop/` y `sitemap.xml`, 2026-10-30.
