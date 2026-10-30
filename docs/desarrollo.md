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

El código de los proyectos no se enlaza: el portal describe cada uno y lleva solo a su versión
pública (web, descarga…) cuando la hay.

## Marca

- Logo: monograma **GV** en `public/marca/gv-logo.svg` (también como componente en
  `src/components/Logo.tsx`). El travesaño de la G se prolonga hasta el brazo de la V.
- Colores: el azul celeste y el blanco de la bandera gallega, sin su composición:
  `#1AA6DF` (celeste), `#0083C1` (celeste intenso), `#FFFFFF`.
- Tipografías: Sora (títulos) e Inter (texto), servidas desde el propio sitio.
- Vista previa al compartir en redes: `public/marca/galivelop-portal.jpg` (1200×630, captura de la
  portada), declarada en `index.html` con URL absolutas (X y otras redes no aceptan rutas relativas).
  Si cambia la portada, rehacer la captura y nada más: `scripts/paginas-estaticas.mjs` pone en cada página la
  imagen que toca (la de la ficha en las fichas) con `?v=<hash de la imagen>`, para que las redes (Discord, X…)
  no se queden con la vista previa antigua. Si cambia la dirección del portal, actualizar esas URL y `SITIO`.
- `node tools/generar-marca.mjs` regenera `gv-logo-512.png` y la imagen para redes
  (`galivelop-social.png`) a partir del SVG (instrucciones en el propio archivo).

## Añadir o actualizar un proyecto

1. Crea `src/data/proyectos/<slug>.json`. Lo más rápido es copiar uno existente
   ([`tarkor.json`](../src/data/proyectos/tarkor.json) o [`toveriai.json`](../src/data/proyectos/toveriai.json)).
   El formato está descrito en [`src/data/tipos.ts`](../src/data/tipos.ts).
2. Pon sus imágenes en `public/proyectos/<slug>/`, en WebP: cada imagen con su versión grande
   (unos 1600 px de ancho) y una `-mini` (unos 720 px) para miniaturas y tarjetas.
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

Correo (recibe los formularios), Discord y GitHub de la marca: [`src/data/marca.ts`](../src/data/marca.ts).

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
- `PAGINAS` de `tools/qa/medir-paginas.cjs`, para que `npm run medir` la mida.
- Claves en `src/i18n/textos.ts` en los tres idiomas; un componente que usan dos páginas, en `src/components/`.
- Si cambia la portada, también las metas de `index.html` y el README.

`src/rutas.test.ts` comprueba que cada ruta fija de `App.tsx` está en `FIJAS` y en `PAGINAS`.

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
- **`pieza`:** la ruta de la pieza dentro de `docs/difusion/` del proyecto con las `/` cambiadas por `-`
  (`2026-10-20-mapa-del-mundo`, o `2026-10-20-01-mapa` si la carpeta es `2026-10-20/01-mapa/`). Es también el
  nombre del archivo, y `npm run check` comprueba que casan.
- Código: [`src/pages/Muro.tsx`](../src/pages/Muro.tsx), [`src/components/Publicacion.tsx`](../src/components/Publicacion.tsx)
  y [`src/data/muro.ts`](../src/data/muro.ts); la página estática, en `scripts/paginas-estaticas.mjs`.

### De dónde salen: `docs/difusion` de cada proyecto

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
  (1200×630, JPEG), que se genera desde la portada con `python3 tools/og/generar.py` (Pillow) al cambiarla. Una
  tarjeta ya compartida no se refresca sola: Facebook (Sharing Debugger), LinkedIn (Post Inspector), Telegram
  (`@WebpageBot`); en Discord y WhatsApp solo cambia si cambia la URL.
- Investigación y fuentes: [`docs/investigacion/seo-indexacion-previews.md`](investigacion/seo-indexacion-previews.md).

## Flujo de trabajo con Claude

Skills, selector de modelo, revisión antes de `main` y retro: [`docs/runbooks/skills-y-modelos.md`](runbooks/skills-y-modelos.md).
Criterio de revisión: [`REVIEW.md`](../REVIEW.md). El flujo es Galivelop-workflow (configuración en `.claude/gw.json`,
scripts en `.claude/gw/scripts/`). Ganchos: `.claude/settings.json` (al empezar la sesión y antes de un PR a `main`),
`.githooks/pre-commit` (sin secretos) y `.githooks/pre-push` (`npm run check` del commit que se sube y, en una subida a
`main` con cambios de código, la marca de `.claude/gw/scripts/revisado.sh` en `docs/registros/revisado.txt`). Lo activa
el gancho de sesión; para subir a mano: `git config core.hooksPath .githooks`.
