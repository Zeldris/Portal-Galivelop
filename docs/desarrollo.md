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
  `#1AA6DF` (celeste, `--celeste`), el celeste hondo `#0072a8` en claro y `#0b5e88` en oscuro (`--celeste-hondo`, que es
  también `--celeste-intenso` en claro; el `#0083C1` de la primera versión ya no se usa) y `#FFFFFF`. Todos los tokens: [`marca.md`](marca.md).
- Tipografías: Big Shoulders Display (títulos, `--fuente-titulos`), Literata (texto, `--fuente-texto`) y JetBrains
  Mono (datos: etiquetas, fechas, cifras; `--fuente-datos`), servidas desde el propio sitio (`@fontsource-variable`).
  La hoja de estilos de la marca completa: [`marca.md`](marca.md).
- Vista previa al compartir en redes: `public/marca/galivelop-portal.jpg` (1200×630) y, para las páginas en gallego e
  inglés, `galivelop-portal-gl.jpg` y `-en.jpg` (las renderiza `node tools/og/portal.mjs` desde `tools/og/portal.html`,
  con los textos de cada idioma en su `<script>`; provisional hasta el recurso 3 de `marca.md`), declarada
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
sin vender: expone los proyectos) y **Productos** (lo que sale del taller; sin precios, todo por correo
con Álvaro; cada integrante es autónomo). Desde la [ADR 0004](adr/0004-productos-en-el-perfil.md) (2026-11-10), los
productos no tienen página, enlace en el menú ni franja en la portada: se ven en el perfil de cada miembro que los lleva,
y `/productos` era una página de paso a `/equipo` (desde el 2026-11-24 es el índice de los productos, con enlace discreto en la cabecera y una banda al final del inicio, sin tocar que cada producto es de su responsable). Desde la [ADR 0003](adr/0003-codigo-abierto-e-implantacion.md)
(2026-11-02), lo maduro tiene el repo público y se ofrece como implantación y servicio de Álvaro (comprarlo sigue
siendo posible); todo lo público admite colaboración (toVeriAI queda fuera, privado). En la portada, los proyectos
van primero (y, desde la 0004, Productos ya no sale en ella). Lo que aún no está maduro se oferta limpio como «próximamente», sin explicar en la web cómo va. Galicia es solo una mención (el nombre), no la
base del mensaje. Marca: azul celeste y blanco de la bandera gallega, sin copiar su composición.
**Dos productos** ([ADR 0005](adr/0005-galivelopcode-unico-producto.md), 2026-11-22, y
[ADR 0006](adr/0006-galivelop-evaluator-segundo-producto.md), 2026-11-24, que corrige el «único producto» de la 0005):
Galivelop Developer, alias **GalivelopCode**, nacido de Galivelop-workflow, y Galivelop Evaluator, alias **GVE**, que
mide si un cambio en un sistema de IA lo mejora; los dos de Álvaro y privados para siempre. Cada uno tiene página propia
(`/productos/<slug>`), que explica en llano para qué sirve (con tono de marca, sin prometer lo que no existe), con un
apartado técnico breve, y invita a escribir. Su código no se enlaza ni se
cuenta. Workflow, IG y Voice son proyectos de código abierto, no productos: la ficha de Workflow y la de IG dicen que
también se implantan. Donde este párrafo y los de arriba choquen, manda este.
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
   y la renderiza `node tools/og/presentacion.mjs galivelop-workflow` (og-fuente en los tres idiomas, presentación
   y og*.jpg). Si la `og-fuente.png` lleva texto, hace falta también en gallego e inglés (ver «Vista previa en redes»).
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
   - `pasos`: «Cómo funciona», los pasos del uso principal (un turno, un análisis…). Un paso puede
     llevar `animacion` (`{ "id", "paso" }`, el paso desde 1): pone el botón «Verlo paso a paso», que
     lleva a ese paso de la animación.
   - `animaciones` (opcional; hoy, solo Galivelop-workflow): animaciones paso a paso que van tras
     «Cómo funciona», una pestaña cada una. Cada una tiene `id`, `titulo`, `pasos` (`titulo` y
     `narracion` de cada paso) y `etiquetas` (los rótulos traducibles del dibujo, por id). El dibujo
     no va en la ficha: es un guion en TS con el mismo `id` en
     [`src/components/animaciones/`](../src/components/animaciones/) (geometría de escritorio y de
     móvil, y qué se ve en cada paso). Los nombres técnicos (`git`, `pre-push`, `main`…) son
     literales del guion y no se traducen. Los tests comprueban que coinciden los pasos y las
     etiquetas, y que cada rótulo cabe en su caja en los tres idiomas; sin JS, la página estática
     lleva cada animación como una lista con el título y la narración de cada paso.
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

**Productos** ([ADR 0002](adr/0002-marca-taller-y-productos.md); desde la
[0004](adr/0004-productos-en-el-perfil.md), en el perfil de su responsable y sus colaboradores) sale de
`src/data/productos/<slug>.json` (formato en [`src/data/productos.ts`](../src/data/productos.ts)); los decide
Álvaro y se mantienen a mano, no con la tarea semanal.

- `slug`, `nombre`, `orden` (de menor a mayor), `acento` (color hex: el vivo; el hondo y el oscuro los calcula `src/data/tonos.ts`, ver `docs/marca.md`, «Acento de cada proyecto») e `icono` (nombre de `Icono`).
- `proyecto` (slug de la ficha del taller) **o** `proximo` (slug de `src/data/proximamente.json`): uno de los dos, para
  enlazar con el taller.
- `estado`: `disponible` o `proximamente` (sale con la etiqueta «Próximamente» y se oferta igual, sin explicar
  cómo va). `version` es opcional (solo la que se ofrece).
- `queOfrece` y cada entrada de `servicios`, en los tres idiomas.
- `responsable` (id de `equipo.json`, el creador) y `colaboradores` (ids).
- Sin precio ni forma de conseguirlo: el botón «Me interesa» abre un correo a la marca con el producto en el asunto.

- `alias` (opcional): el otro nombre por el que se le conoce; sale bajo el título y en el `<title>` de su página.
- Sin precio ni enlace al repositorio si es privado.

**Su página, `/productos/<slug>`** ([ADR 0005](adr/0005-galivelopcode-unico-producto.md)): la tiene el producto con el bloque
`pagina` en su JSON (tipo `PaginaProducto`); sin él, solo sale en el perfil y la ruta da 404. La pinta
[`src/pages/Producto.tsx`](../src/pages/Producto.tsx) y la tarjeta del perfil la enlaza con «Ver el producto».

- `actualizado` (AAAA-MM-DD; el `lastmod` del sitemap: se cambia al tocar los textos), `seo` (título y descripción),
  `portada` (opcional: `src` de 1600 × 900 y `mini` de 720 × 405, en `public/`, con `alt`; sin ella la cabecera es solo
  texto), `lema` (un texto por renglón), `entrada`, `problema`, `beneficios` (`titulo` e `items`), `pasosTitulo`,
  `pasos` (cuatro), `figuras` (diagramas bajo los pasos: `src`, `mini`, `srcOscuro`, `miniOscuro` (la versión del tema oscuro), `ancho`, `alto`, `alt` y `pie`, este opcional; los SVG de
  Developer y Evaluator salen de `scripts/diagramas/productos.py` y sus webp, de `node scripts/diagramas-webp.mjs gd-harness gd-harness-oscuro gve-evaluacion gve-evaluacion-oscuro`), `garantiasTitulo`, `garantias`, `paraQuien` (`titulo` e `items`), `estadoTexto`,
  `contacto` y `tecnico` (`papeles` y `papelesTexto`, opcionales; `datos`; `codigo: true` si el valor es una orden). Todo, en los tres idiomas.
- El estado es solo la etiqueta «Próximamente»: la página no cuenta versiones hechas ni lo que falta.
- El botón abre un correo a `MARCA.correo` con el asunto `productos.asunto` («<nombre>: Primer contacto», traducido).
- Su guion de lectura es `src/data/guiones/<slug>.json` (`"pagina": "/productos/<slug>"`); si cambian los pasos o las
  garantías, se reescribe su trozo y se vuelve a grabar.
- Un producto nuevo con página: su ruta, en `PAGINAS` de `tools/qa/medir-paginas.cjs`. El sitemap, el `<title>`, la
  vista previa, el JSON-LD y la línea de `llms.txt` salen solos de `scripts/paginas-estaticas.mjs`.

`npm run check` comprueba todo esto (`src/data/productos.test.ts`) y `scripts/paginas-estaticas.mjs` lista los
productos en la página estática de cada miembro; `/productos` (2026-11-24) es el índice de los productos, con un enlace gris en la cabecera y una banda al final del inicio; `DE_PASO` quedó vacío.

## Añadir una página

Una ruta nueva toca siempre los mismos sitios; al hacer `/productos` se olvidaron dos (2026-10-27). La lista:

- `src/App.tsx` (la `Route`) y su componente en `src/pages/`, cargado por partes: en `CARGADORES`,
  `perezosa(...)` y `PAGINA_DE_PRIMER_SEGMENTO` de `src/paginas.ts` (ver «Carga por partes»).
- `src/components/Cabecera.tsx` si va en el menú (y `Pie.tsx` si va en el pie).
- `FIJAS` de `scripts/paginas-estaticas.mjs`: título y descripción en es/gl/en (página estática, sitemap y `llms.txt`).
- Si tiene contenido propio, su rama en `cuerpo()` de `scripts/paginas-estaticas.mjs`; sin ella, la página estática
  solo lleva título y descripción (se olvidó con los textos legales, 2026-10-31).
- `PAGINAS` de `tools/qa/medir-paginas.cjs`, para que `npm run medir` la mida; si trae una rejilla nueva, sus
  columnas en `COLUMNAS` del mismo archivo.
- Claves en `src/i18n/textos.ts` en los tres idiomas; un componente que usan dos páginas, en `src/components/`.
- Si cambia la portada, también las metas de `index.html` y el README.

`src/rutas.test.ts` comprueba que cada ruta fija de `App.tsx` está en `FIJAS` y en `PAGINAS`.

## Guiones de lectura

Un guion por página de contenido, escrito para el oído, en `src/data/guiones/<página>.json` (`inicio`, el slug de
cada ficha, el `id` de cada miembro…); legales y 404 no llevan. Lo cuenta un narrador en tercera persona, también en
la página de cada miembro. Lo leerá la voz `lectora-es` (audio pregrabado) mientras la página baja y
resalta cada sección: el lector flotante (`src/components/Lector.tsx`).

- `narra`: la fecha de lo que cuenta (en una ficha, su `actualizado`). Si la página cambia, se revisa el guion y la fecha.
- `trozos`: uno por sección, en orden; `seccion` es el `id` del elemento (`proyectos`, `resumen`, `avance`…) o, si no
  tiene, un nombre fijo (`cabecera`, `vistazo`, `participar`). Cada uno lleva `es` (a mano); `gl` y `en`, traducidos.
- `enfoques` (opcional, por trozo): en una sección más alta que la pantalla, o que recorre varios elementos (tarjetas,
  apartados, hitos, campos), `[{ "frase": "<texto literal y único del `es` del trozo>", "ver": "<id o data-guion>" }]`.
  Cuando el audio llega a esa frase, el lector contornea ese elemento y lo lleva a la parte de la ventana que no tapan
  la cabecera, la barra de grupos de la ficha ni la barra del lector: centrado si cabe, su inicio si no, y sin mover
  la vista si ya se ve entero (así no tiembla en móvil al pasar de una tarjeta a la de al lado). El momento sale de la posición de la frase en el texto (`audio.duration` × posición / longitud),
  así que no hay tiempos a mano y vale si se regraba. Los elementos llevan `data-guion` derivado de los datos
  (`proyecto-<slug>`, `producto-<slug>`, `linea-<id>`, `hito-<versión>-<nombre>` y `caracteristica-<título>` (slug del castellano, `anclaGuion`), `decision-<n>`, `paso-<n>`, `campo-<x>`; los apartados, su
  `ap-<id>`).
  Un test comprueba que cada frase está una vez en su trozo y que cada `seccion` y `ver` existe en la página.
- `audio`: idiomas con audio grabado (`"audio": ["es"]`); obligatorio, `[]` si el guion no tiene audio (el build lo
  pide: `LectorCarga` lee solo este campo de cada guion). Solo con un idioma listado aparece el
  lector (botón flotante, solo en ese idioma) en su página; un test comprueba que existe el MP3 de cada trozo y que
  ningún guion con `[]` tiene su carpeta de audio a medias. Al grabar un idioma nuevo, se añade aquí.
- Las secciones sin `id` llevan `data-guion="<nombre>"` en la página (el lector busca primero el `id`); otro test
  comprueba que cada `seccion` de inicio y tarkor existe en la página.
- `notas`: pronunciación de los nombres y qué hace envejecer el guion.
- **Audio:** un MP3 por trozo en `public/audio/<idioma>/<página>/<nn>-<seccion>.mp3` (`nn`, el orden del trozo desde
  `01`), mono a 48 kbps. Sale de los WAV aprobados del generador de voces
  (`~/.local/share/galivelop-voice/proyectos/portal/final/<idioma>/<página>/`), que no se suben:
  `ffmpeg -i <nn>-<seccion>.wav -ac 1 -codec:a libmp3lame -b:a 48k <nn>-<seccion>.mp3`. Si cambia un trozo, se
  regenera su audio.
- **Al día con la página:** cuando `gw-portal` (también la tarea semanal) cambia una ficha o los proyectos del inicio,
  reescribe los trozos de su guion que ya no sean verdad y apunta su «audio pendiente» en la bitácora; el audio lo graba
  la persona. Una página o sección nueva la añade una sesión.
- Para el oído: frases cortas, sin paréntesis, siglas ni símbolos (`d20`, `%`, `NPC`); números con letra cuando se
  leen raro. Sin cifras que cambian cada semana: las novedades se invitan a leer, no se narran. Se respeta [«Mensaje»](#mensaje).

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
npm run medir    # tras el build: alto, desbordes, cortes, zonas táctiles y columnas de las rejillas, en texto
npm run capturas -- <ruta> [selector | --menu]   # tras el build: captura de una página, sección o menú móvil, con medidas
npm run probar:lector [-- <ruta>…]   # tras el build: recorre el lector en escritorio y móvil; captura y comprueba cada trozo y enfoque
node tools/qa/recorrido.cjs [--url <base>] [--anchos 320,768]   # tras el build: 7 anchos x tema claro/oscuro, foco con Tab y enlaces internos, en texto
```

`medir` mide alto, cortes y columnas (móvil y escritorio, en claro); `recorrido` cubre lo que `medir` no: anchos de tablet a 1920,
tema oscuro, contraste del contorno de foco (< 3:1) y enlaces internos que no dan 200. Páginas: las de `dist/sitemap.xml`; sale con 1 si hay problemas.

El formato lo fija `.prettierrc` (comillas simples, ancho 100); `npx prettier --write "src/**/*.{ts,tsx}"` lo arregla.

React 19 + Vite + TypeScript, React Router y lucide para los iconos. Sin backend: todo es estático.

### Carga por partes

El JS inicial lleva solo la portada y lo común; cada página y cada ficha de proyecto se bajan al entrar.

- **Páginas:** `src/paginas.ts` guarda el `import()` de cada una (`CARGADORES`) y lo comparte con `lazy`. `main.tsx`
  espera `precargarRuta(location.pathname)` antes de pintar, así que la página que se abre en frío no parpadea en
  blanco sobre el HTML estático. Si falla la descarga de una parte (una versión nueva publicada mientras la pestaña
  estaba abierta), `vite:preloadError` recarga una sola vez (clave `galivelop.recarga` de `sessionStorage`, contada
  en `src/data/legal/privacidad.json`); si vuelve a fallar, `ErrorBoundary` enseña `AvisoError` con «Recargar».
- **Fichas:** la portada, el menú y las tarjetas leen `proyectos` (`src/data/proyectos.ts`), un resumen que genera
  el plugin `tools/vite/resumenes.ts` (módulo `virtual:proyectos-resumen`) con los campos de `CAMPOS_RESUMEN`. La
  ficha entera la trae `useFicha(slug)` (`cargando`, `no-existe`, `error` con `reintentar`, `listo`). **Un campo
  nuevo que necesite la portada o una tarjeta** se añade a `CAMPOS_RESUMEN`; si no, en esas páginas sale `undefined`
  aunque esté en el JSON (el tipo `ResumenProyecto` sale de esa lista, así que `tsc` lo avisa).

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
  (1200×630, JPEG), que genera `python3 tools/og/generar.py` (Pillow; `tools/og/limpiar.py` necesita además numpy) desde `tools/og/fuentes/<slug>/og-fuente.png` (una imagen hecha para
  redes, p. ej. del generador de imágenes de Galivelop; fuera de `public/` para que no salga en `dist/`) si existe, y si no desde la portada; se
  vuelve a correr al cambiar cualquiera de las dos. **Cada página enseña la vista previa en su idioma**: si la imagen
  lleva texto, `og-fuente-gl.png` y `og-fuente-en.png` dan `og-gl.jpg` y `og-en.jpg`, que el generador usa en
  `/gl/` y `/en/` (sin ellas, `og.jpg`). Para una `og-fuente.png` hecha a mano con el texto dentro:
  `python3 tools/og/limpiar.py` saca su placa sin texto (`og-base.png`), `tools/og/<slug>-og.html` pone encima el
  texto de cada idioma con las mismas fuentes (de `node_modules/@fontsource*`) y `node tools/og/traducir.mjs <slug>`
  las renderiza y corre `generar.py` (así está Galivelop IG). Si la placa viene del generador sin texto (recurso 24:
  Tarkor y toVeriAI), la plantilla pinta también el castellano: `node tools/og/traducir.mjs <slug> --es`. El texto alternativo de la vista previa es el
  de `ogAlt` si la ficha lo trae (una placa con composición propia, como las de Tarkor y toVeriAI), si no el de
  `presentacion` (o el de la portada), en el idioma de la página. Una
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
