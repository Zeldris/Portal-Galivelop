# Desarrollo del portal Galivelop

Guía técnica del portal: qué hay, cómo añadir proyectos o personas del equipo y cómo se publica.
La presentación pública está en el [README](../README.md).

## Qué hay

- **Portada:** presentación del taller, proyectos con filtro por estado (publicado, en desarrollo,
  en diseño), «El taller» y «Participa» (cómo colaborar, proponer o aprender).
- **Página de cada proyecto** (`/proyectos/<slug>`, también desde el submenú «Proyectos» de la
  cabecera): cabecera con estado y enlace público; «De un vistazo» (fase, avance, siguiente hito,
  última novedad y cifras); una barra fija que marca el grupo que se lee y lleva a cada uno; y los
  grupos, todo a la vista: **Resumen** (el proyecto, qué lo hace distinto, cómo funciona),
  **Galería** (capturas e ilustraciones, a pantalla completa), **A fondo** (los apartados propios,
  p. ej. el mundo de Tarkor o las dimensiones del IMI, como mosaico: cada uno se abre en una hoja
  encima de la página, con flechas entre temas y enlace propio `#ap-<id>`), **Cómo está hecho**
  (ficha técnica, lo que estamos aprendiendo, decisiones de diseño) y **Avance** (hoja de ruta,
  novedades y equipo). Un grupo sin contenido no sale.
- **Participa:** formularios para proponer un proyecto (`/participa/proponer`) y para unirse al
  taller (`/participa/unirse`, con `?proyecto=<slug>` o `?modo=aprender` para preseleccionar).
  Como la web es estática, preparan un correo a `alvarogarciagrana@gmail.com` (asunto
  `[Galivelop] Propuesta: …` o `[Galivelop] Unirse al taller: …`, siempre en castellano) que se
  envía desde la aplicación de correo de quien lo rellena; si no se abre, se puede copiar.
- **Idiomas:** castellano, gallego e inglés (detecta el del navegador y recuerda la elección).
- **Tema** claro y oscuro.

El código de cada proyecto se enlaza desde su ficha («Ver el código en GitHub», tipo `otro` en `enlaces`)
cuando su repositorio es público; si es privado, no se enlaza. Además, el portal lleva a su versión pública
(web, descarga…) cuando la hay.

## Marca

- Logo: monograma **GV** en `public/marca/gv-logo.svg` (también como componente en
  `src/components/Logo.tsx`). El travesaño de la G se prolonga hasta el brazo de la V.
- Colores: el azul celeste y el blanco de la bandera gallega, sin su composición:
  `#1AA6DF` (celeste), `#0083C1` (celeste intenso), `#FFFFFF`.
- Tipografías: Big Shoulders Display (títulos, `--fuente-titulos`), Literata (texto, `--fuente-texto`) y JetBrains
  Mono (datos: etiquetas, fechas, cifras; `--fuente-datos`), servidas desde el propio sitio (`@fontsource-variable`).
  La hoja de estilos de la marca completa: [`marca.md`](marca.md).
- Vista previa al compartir en redes: `public/marca/galivelop-portal.jpg` (1200×630; la renderiza
  `node tools/og/portal.mjs` desde `tools/og/portal.html`, provisional hasta el recurso 3 de `marca.md`), declarada
  en `index.html` con URL absolutas (X y otras redes no aceptan rutas relativas).
  Si cambia la portada, rehacer la imagen y nada más: `scripts/paginas-estaticas.mjs` pone en cada página la
  imagen que toca (la de la ficha en las fichas) con `?v=<hash de la imagen>`, para que las redes (Discord, X…)
  no se queden con la vista previa antigua. Si cambia la dirección del portal, actualizar esas URL y `SITIO`.
- `node tools/generar-marca.mjs` regenera `gv-logo-512.png` y la imagen para redes
  (`galivelop-social.png`) a partir del SVG (instrucciones en el propio archivo).

### Mensaje

Traído de `AGENTS.md` (retro 2026-11-02).

Mensaje de la marca (2026-10-04, ampliado el 2026-10-27 con la [ADR 0002](adr/0002-marca-taller-y-productos.md)):
**Galivelop es la marca** que contiene el **taller** (crear, investigar, innovar, aprender; abierto a colaborar y
sin vender: expone los proyectos) y **Productos** (`/productos`: lo que sale del taller e integrantes promocionados; sin precios, todo por correo
con Álvaro; cada integrante es autónomo). Desde la [ADR 0003](adr/0003-codigo-abierto-e-implantacion.md)
(2026-11-02), lo maduro tiene el repo público y se ofrece como implantación y servicio de Álvaro (comprarlo sigue
siendo posible); todo lo público admite colaboración (toVeriAI queda fuera, privado). En la portada, los proyectos
van antes que Productos. Lo que aún no está maduro se oferta limpio como «próximamente», sin explicar en la web cómo va. Galicia es solo una mención (el nombre), no la
base del mensaje. Marca: azul celeste y blanco de la bandera gallega, sin copiar su composición.
**Encargos por miembro** ([ADR 0001](adr/0001-encargos-por-miembro.md), publicado el 2026-10-26): el
taller no vende, pero cada miembro puede colaborar por su cuenta en proyectos de otras personas. Se dice en la
página de ese miembro (`colabora`), en una banda discreta de Participa, en «Cómo trabajamos» y en el README, sin
«de pago» ni distintivos.

## Añadir o actualizar un proyecto

1. Crea `src/data/proyectos/<slug>.json`. Lo más rápido es copiar uno existente
   ([`tarkor.json`](../src/data/proyectos/tarkor.json) o [`toveriai.json`](../src/data/proyectos/toveriai.json)).
   El formato está descrito en [`src/data/tipos.ts`](../src/data/tipos.ts).
2. Pon sus imágenes en `public/proyectos/<slug>/`, en WebP: cada imagen con su versión grande
   (unos 1600 px de ancho) y una `-mini` (unos 720 px) para miniaturas y tarjetas.
   Opcional, `presentacion`: la imagen de redes del proyecto (apaisada 1.9:1, 1600×840 y `-mini` 720×378), que el
   collage de la portada usa en vez de la `portada` cuando esta es una captura o un diagrama; sale del mismo
   `og-fuente.png` que su `og.jpg`. La de Galivelop-workflow se compone en `tools/og/galivelop-workflow-presentacion.html`
   y la renderiza `node tools/og/presentacion.mjs galivelop-workflow` (og-fuente, presentación y og.jpg).
3. Todo texto visible va en los tres idiomas: `{ "es": "…", "gl": "…", "en": "…" }`.
4. Detalles útiles:
   - `orden`: el siguiente número libre (el mayor de los existentes más uno). El portal muestra
     primero el último añadido, el de mayor `orden`.
   - `estado`: `publicado`, `desarrollo` o `diseno`.
   - `colaboracion`: `abierta` (se puede participar) o `privada` (solo se aceptan propuestas e
     interesados; hoy, solo toVeriAI).
   - `cabecera`: `"captura"` si la portada es una captura de web o app (se enmarca en una ventana);
     sin el campo, la portada se usa de fondo.
   - `galeria` (ilustraciones) y `capturas` (capturas reales de la interfaz; `[]` si no hay) se
     muestran juntas en la galería de arriba: primero las capturas, luego las ilustraciones, con una
     pestaña por grupo si hay los dos. Rota sola cada 6 s en bucle; al usarla a mano se para y
     vuelve a rotar tras 3 minutos sin tocarla (`src/components/Galeria.tsx`).
   - `hitos[].estado`: `hecho`, `curso` o `pendiente`. El porcentaje de avance sale de ahí.
   - `caracteristicas[].icono`: uno de los nombres de [`src/components/Icono.tsx`](../src/components/Icono.tsx).
   - `lineas`: líneas de trabajo del taller a las que pertenece (`ia-local`, `mundos`,
     `informacion`, `producto`; ver [`src/data/lineas.ts`](../src/data/lineas.ts)).
   - `descripcion`: tres párrafos, como un caso de estudio: el reto, el enfoque y dónde está hoy.
   - `aprendizajes`: lo que el proyecto nos está obligando a aprender.
   - `pasos`: «Cómo funciona», los pasos del uso principal (un turno, un análisis…).
   - `apartados`: secciones propias del proyecto, cada una con `id`, `titulo`, `intro` opcional e
     `items` (`nombre`, `texto` y un `valor` corto opcional, igual en todos los idiomas).
   - `contacto`: correo propio del proyecto (opcional); aparece en su ficha y en «Contacto».
   - Las secciones que dejes vacías (`[]`) no se muestran.
5. `npm run check`: los tests avisan si falta un texto en algún idioma, una imagen o un icono.

No hay que tocar código: cualquier `.json` de esa carpeta aparece solo en la portada.

Correo (recibe los formularios), Discord y GitHub de la marca: [`src/data/marca.ts`](../src/data/marca.ts). El
JSON-LD de `scripts/paginas-estaticas.mjs` y el README los repiten, y `src/data/marca.test.ts` exige que coincidan.
La invitación de Discord se crea con «Caducar: nunca»: una de 7 o 30 días deja rotos todos los botones del portal.

## Añadir o actualizar un producto

**Productos** (`/productos`, [ADR 0002](adr/0002-marca-taller-y-productos.md)) sale de
`src/data/productos/<slug>.json` (formato en [`src/data/productos.ts`](../src/data/productos.ts)); los decide
Álvaro y se mantienen a mano, no con la tarea semanal.

- `slug`, `nombre`, `orden` (de menor a mayor), `acento` (color hex) e `icono` (nombre de `Icono`).
- `proyecto` (slug de la ficha del taller) **o** `proximo` (slug de `src/data/proximamente.json`): uno de los dos, para
  enlazar con el taller.
- `estado`: `disponible` o `proximamente` (sale con la etiqueta «Próximamente» y se oferta igual, sin explicar
  cómo va). `version` es opcional (solo la que se ofrece).
- `queOfrece` y cada entrada de `servicios`, en los tres idiomas.
- `responsable` (id de `equipo.json`, el creador) y `colaboradores` (ids).
- Sin precio ni forma de conseguirlo: el botón «Me interesa» abre un correo a la marca con el producto en el asunto.

Un **integrante promocionado** lleva en `equipo.json` `promocionado: true` y `servicios` (lista de textos en los
tres idiomas); sale en Productos con acceso a su página de miembro.

`npm run check` comprueba todo esto (`src/data/productos.test.ts`) y `scripts/paginas-estaticas.mjs` genera la
página estática de `/productos`.

## Añadir una página

Una ruta nueva toca siempre los mismos sitios; al hacer `/productos` se olvidaron dos (2026-10-27). La lista:

- `src/App.tsx` (la `Route`) y su componente en `src/pages/`.
- `src/components/Cabecera.tsx` si va en el menú (y `Pie.tsx` si va en el pie).
- `FIJAS` de `scripts/paginas-estaticas.mjs`: título y descripción en es/gl/en (página estática, sitemap y `llms.txt`).
- Si tiene contenido propio, su rama en `cuerpo()` de `scripts/paginas-estaticas.mjs`; sin ella, la página estática
  solo lleva título y descripción (se olvidó con los textos legales, 2026-10-31).
- `PAGINAS` de `tools/qa/medir-paginas.cjs`, para que `npm run medir` la mida.
- Claves en `src/i18n/textos.ts` en los tres idiomas; un componente que usan dos páginas, en `src/components/`.
- Si cambia la portada, también las metas de `index.html` y el README.

`src/rutas.test.ts` comprueba que cada ruta fija de `App.tsx` está en `FIJAS` y en `PAGINAS`.

## Textos legales y pie

- **Aviso legal, privacidad y términos** viven en `src/data/legal/<slug>.json` (es, gl y en), con su página en
  `/aviso-legal`, `/privacidad` y `/terminos` (`src/pages/Legal.tsx`). Cada sección lleva párrafos, filas de datos
  (`datos`, con `enlace` opcional), lista y enlaces. Al cambiar uno, se cambia su `actualizado`.
- **Los cambia una sesión con el titular**, nunca la tarea semanal (`legal/` va en `A_MANO` de
  `src/data/tarea-semanal.test.ts`). La privacidad describe lo que hace el portal: si se añade analítica, un
  formulario con servidor, fuentes o scripts de otro sitio, o un dato nuevo en `localStorage`, se actualiza antes.
- **Titular y repositorio**, en `src/data/marca.ts` (`titular`, `repositorio`). Licencias: código MIT (`LICENSE`),
  textos e imágenes propias CC BY 4.0, con las excepciones del aviso legal.
- **El pie** (`src/components/Pie.tsx`) va en columnas: marca y redes, Taller (los proyectos), Galivelop,
  Participa y Legal (los textos de `src/data/legal/`, por `orden`); debajo, el titular y las licencias.

## Añadir o actualizar a alguien del equipo

La página **Equipo** (`/equipo`) y la **página de cada miembro** (`/equipo/<id>`) salen de
[`src/data/equipo.json`](../src/data/equipo.json). Cada persona:

- `id` (la ruta `/equipo/<id>` y el anclaje `/equipo#<id>`, que siguen enlazados: no se cambia una vez publicado),
  `nombre`, `orden`.
- `rol` y `bio` en los tres idiomas.
- `proyectos`: slugs de los proyectos en los que participa.
- `papeles`: uno por cada slug de `proyectos` (el test lo exige), `creo` («Lo creó») o `equipo` («Forma parte del equipo»).
- `perfil` (opcional): trayectoria, formación, tecnologías, idiomas y fortalezas; solo sale en su página.
  - Cada etapa de `trayectoria` o `formacion`: `titulo` (el puesto), `lugar`, `desde`/`hasta` (`AAAA-MM`; sin
    `hasta`, «actualidad») y, opcionales, `descripcion` (qué hizo, en los tres idiomas) y `logo` (ruta en `public/`,
    por ejemplo `equipo/empresas/orienteed.svg`; sin él, las iniciales del sitio). Las etapas seguidas en el mismo
    `lugar` se agrupan bajo un solo logo, que basta poner en una de ellas. El test comprueba que el logo existe.
  - `clientes` (opcional): para quién trabajó desde esa empresa (consultorías), con su nombre comercial; sale bajo
    el nombre de la empresa, y las etapas agrupadas juntan los suyos sin repetirlos. `lugar` también es opcional:
    una titulación sin centro va sin él, con su título de encabezado y un birrete en vez del logo.
  - `negocio` (opcional): `["B2C"]`, `["B2B"]` o los dos; sale como etiqueta junto al nombre de la empresa y, como
    los clientes, se junta entre las etapas agrupadas. Es igual en los tres idiomas.
  - `perfil.destacadas`: las pocas tecnologías de la tarjeta corta del miembro en cada proyecto. En su página no
    salen: `tecnologias` ya las lista todas, por grupos.
  - Cada tecnología lleva su icono de Simple Icons (`src/components/IconoTecnologia.tsx`). Una nueva se añade ahí,
    en `ICONOS` (si tiene logo en Simple Icons) o en `MONOGRAMAS`; el test falla si falta.
  - Las cifras de la cabecera (años, empresas, clientes, proyectos) salen solas de los datos (los años, sumando las etapas sin huecos ni solapes); solo se ven las que no son cero.
- `colabora` (opcional): `{ "texto": { es, gl, en }, "correo": … }`. Si el miembro colabora por su cuenta en
  proyectos de otras personas, su página termina con ese texto y un botón de correo
  ([ADR 0001](adr/0001-encargos-por-miembro.md)). Sin él, la página no dice nada de colaborar.
- `redes`: lista de `{ "tipo": …, "url": … }` con `tipo` uno de `linkedin`, `github`, `web`,
  `correo`, `x`, `instagram`, `youtube`, `discord`, `reddit`, `manfred` o `portfolio` (para `correo`, la dirección
  sin `mailto:`). `web` es una web cualquiera; `portfolio`, el porfolio de la persona.
- `foto` (opcional): ruta en `public/`; sin ella se muestran las iniciales.

En la ficha de un proyecto, quien figure en su `equipo` con el mismo nombre enlaza a su página.

## El muro

`/muro` es una sección tipo red social: publicaciones de todos los proyectos, de la más reciente a la más antigua,
con un filtro por proyecto (`/muro?proyecto=<slug>`) y un ancla por publicación (`#<slug>-<pieza>`). Cada ficha
muestra sus 3 últimas con un enlace al muro filtrado. Sin publicaciones, ni el enlace del menú ni la página
estática existen.

- **Datos:** `src/data/muro/<slug>/<pieza>.json`, con el formato `Publicacion` de
  [`src/data/tipos.ts`](../src/data/tipos.ts): `proyecto`, `pieza`, `fecha`, `titulo`, `texto` (la entradilla),
  `cuerpo` (párrafos, opcional) e `imagenes` (opcional). Todo texto, en los tres idiomas.
- **Imágenes:** en `public/proyectos/<slug>/muro/<pieza>/`, WebP grande (unos 1600 px) y `-mini` (unos 720 px). Una
  imagen con texto dentro puede tener versión por idioma en `porIdioma` (`{ "en": { "src", "mini" } }`); sin ella, se
  usa la de `src`/`mini`.
- **`pieza`:** la ruta de la pieza dentro de `docs/media/` (antes `docs/difusion/`) del proyecto con las `/` cambiadas por `-`
  (`2026-10-20-mapa-del-mundo`, o `2026-10-20-01-mapa` si la carpeta es `2026-10-20/01-mapa/`). Es también el
  nombre del archivo, y `npm run check` comprueba que casan.
- Código: [`src/pages/Muro.tsx`](../src/pages/Muro.tsx), [`src/components/Publicacion.tsx`](../src/components/Publicacion.tsx)
  y [`src/data/muro.ts`](../src/data/muro.ts); la página estática, en `scripts/paginas-estaticas.mjs`.

### De dónde salen: `docs/media` (antes `docs/difusion`) de cada proyecto

Las publicaciones las escribe la tarea semanal a partir de la carpeta de difusión de cada proyecto (la rellena la
skill `gw-media-content` del flujo). De cada pieza lee solo su `web.md`, que lleva un bloque JSON:

```json
{
  "estado": "listo",
  "fecha": "AAAA-MM-DD",
  "texto": { "es": "…", "gl": "…", "en": "…" },
  "muro": {
    "titulo": { "es": "…", "gl": "…", "en": "…" },
    "cuerpo": [{ "es": "…", "gl": "…", "en": "…" }],
    "imagenes": [
      { "archivo": "medios/mapa.webp", "alt": { "es": "…", "gl": "…", "en": "…" } },
      { "archivo": { "es": "medios/tarjeta.es.webp", "en": "medios/tarjeta.en.webp" }, "alt": { "es": "…", "gl": "…", "en": "…" } }
    ]
  }
}
```

- Se publica solo con `"estado": "listo"` y `fecha` de hoy o anterior (una con fecha futura sale el domingo en que ya toque); cualquier otro estado (o sin él) se ignora.
- `texto` es la novedad de la ficha (como hasta ahora). Con `muro`, además, una publicación: `titulo` y `cuerpo`
  de ahí, `texto` como entradilla.
- `archivo` es relativo a la carpeta de la pieza; a su lado tiene que estar su `-mini`. Con versiones por idioma, la
  de `es` va en `src`/`mini` y las demás en `porIdioma`.
- Una pieza que ya tiene su archivo en `src/data/muro/` no se vuelve a publicar; si su `web.md` cambia, se
  actualiza el mismo archivo.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173/Portal-Galivelop/
npm run check    # tipos, formato (prettier), tests y ganchos
npm run build    # genera dist/ (con 404.html para las rutas en GitHub Pages)
npm run medir    # tras el build: alto, desbordes, cortes y zonas táctiles de cada página, en texto
npm run capturas -- <ruta> [selector | --menu]   # tras el build: captura de una página, sección o menú móvil, con medidas
```

El formato lo fija `.prettierrc` (comillas simples, ancho 100); `npx prettier --write "src/**/*.{ts,tsx}"` lo arregla.

React 19 + Vite + TypeScript, React Router y lucide para los iconos. Sin backend: todo es estático.

## Publicación

Cada push a `main` ejecuta [`.github/workflows/pages.yml`](../.github/workflows/pages.yml): comprueba,
construye y publica en GitHub Pages. Hace falta, una sola vez, ir a **Settings → Pages → Build and
deployment → Source** y elegir **GitHub Actions**.

Con un dominio propio, construir con `BASE_PATH=/` (ver [`vite.config.ts`](../vite.config.ts)) y añadir
el dominio en Settings → Pages.

© Galivelop. Todos los derechos reservados.

## SEO

Cada idioma tiene su dirección: castellano sin prefijo, gallego en `/gl/…` e inglés en `/en/…`.
Tras `vite build`, [`scripts/paginas-estaticas.mjs`](../scripts/paginas-estaticas.mjs) crea una página
HTML por ruta e idioma (con `hreflang`) (portada, cada proyecto, equipo, cada miembro y participa) con su título, descripción, canónica y
vista previa, con su texto en HTML para buscadores sin JavaScript y datos
estructurados schema.org, y genera `sitemap.xml`, `robots.txt`, `llms.txt` y el archivo de la clave de IndexNow. Una
ruta nueva se añade en ese script. La dirección del portal y la clave están en [`scripts/sitio.mjs`](../scripts/sitio.mjs).

- **`lastmod`:** el `actualizado` del proyecto o del muro; en las demás páginas, la fecha del último commit de los
  datos de su contenido principal (`equipo.json`, `marca.ts`…; no `textos.ts`, que es de todas las páginas). Sin historia completa de git se omite: por eso `pages.yml` clona con
  `fetch-depth: 0`.
- **Avisar a los buscadores:** Google no admite avisos (retiró el ping del sitemap en 2023): se usa Search Console.
  [`scripts/indexnow.mjs`](../scripts/indexnow.mjs) compara, antes de desplegar, el sitemap nuevo con el publicado, y
  el job `avisar` de `pages.yml` manda después por IndexNow (Bing, Yandex, Seznam, Naver…) las páginas nuevas o con
  otro `lastmod` (`node scripts/indexnow.mjs cambios`, tras `npm run build`, enseña cuáles serían).
- **Vista previa en redes:** `og:locale` por idioma; la de cada proyecto es `public/proyectos/<slug>/og.jpg`
  (1200×630, JPEG), que genera `python3 tools/og/generar.py` (Pillow) desde `tools/og/fuentes/<slug>/og-fuente.png` (una imagen hecha para
  redes, p. ej. del generador de imágenes de Galivelop; fuera de `public/` para que no salga en `dist/`) si existe, y si no desde la portada; se
  vuelve a correr al cambiar cualquiera de las dos. Una
  tarjeta ya compartida no se refresca sola: Facebook (Sharing Debugger), LinkedIn (Post Inspector), Telegram
  (`@WebpageBot`); en Discord y WhatsApp solo cambia si cambia la URL.
- **Título y descripción:** los de cada página van en `FIJAS` del script; los de un proyecto salen de su lema y su
  resumen, salvo que la ficha traiga `seo` (`titulo`, `descripcion`), más cortos: Google corta el título a unos 60
  caracteres y la descripción a unos 160 (`src/data/proyectos.test.ts` lo comprueba para `seo`).
- **Comprobar:** `npm run build && npm run seo` revisa las páginas generadas (título, descripción, canónica, `hreflang`,
  vista previa, JSON-LD, sitemap, `robots.txt` y que es/gl/en vayan parejos); el criterio y las fuentes, en la skill
  [`gw-seo`](../.claude/skills/gw-seo/SKILL.md) y su nota del portal, [`.claude/gw/gw-seo.md`](../.claude/gw/gw-seo.md).
- Investigación y fuentes: [`docs/investigacion/seo-indexacion-previews.md`](investigacion/seo-indexacion-previews.md).

## Flujo de trabajo con Claude

Skills, selector de modelo, revisión antes de `main` y retro: [`docs/runbooks/skills-y-modelos.md`](runbooks/skills-y-modelos.md).
Criterio de revisión: [`REVIEW.md`](../REVIEW.md). El flujo es Galivelop-workflow (configuración en `.claude/gw.json`,
scripts en `.claude/gw/scripts/`). Ganchos: `.claude/settings.json` (al empezar la sesión y antes de un PR a `main`),
`.githooks/pre-commit` (sin secretos) y `.githooks/pre-push` (`npm run check` del commit que se sube y, en una subida a
`main` con cambios de código, la marca de `.claude/gw/scripts/reviewed.sh` en `docs/records/reviewed.txt`). Lo activa
el gancho de sesión; para subir a mano: `git config core.hooksPath .githooks`.
