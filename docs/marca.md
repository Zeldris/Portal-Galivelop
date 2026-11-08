# Marca Galivelop: hoja de estilos

**Estado:** borrador aprobado en dirección por la persona (2026-11-08), pendiente de elegir tipografía y de aplicarlo a
`src/estilos/global.css`. Prototipo: https://claude.ai/artifact/UoLydvcktgu8jYwioKbygq. Referencias y fuentes:
[`investigacion/estilo-marca.md`](investigacion/estilo-marca.md). El mensaje (qué decimos) sigue en
[`desarrollo.md#mensaje`](desarrollo.md#mensaje); aquí va cómo se ve.

## Carácter

**Cuaderno de taller sobre carta náutica.** Un taller enseña cómo trabaja: papel claro, retícula fina, filetes, datos
en monoespaciada. El mar de Galicia entra como lo dibuja una carta: isobatas, coordenadas, escalas, numeración de
puerto; nunca como olas, gaviotas o degradados turquesa. El celeste de la marca se usa en bloques grandes y planos,
como hacen las marcas con un color propio (Razer con su verde), no como acento tímido.

Cinco adjetivos: **técnico, sereno, atlántico, artesano, abierto.**

## Reglas

Lo que nos separa de las webs genéricas hechas con IA. Cada regla pasa a comprobación en cuanto se rompa dos veces.

1. **Tema claro por defecto.** El oscuro existe y se cuida, pero el blanco es la mitad de la marca.
2. **Nada de resplandores, desenfoques ni degradados de fondo.** Ni `backdrop-filter`, ni `--brillo`, ni sombras
   difusas grandes. La profundidad se da con filetes y con planos de color.
3. **Esquinas rectas o con chaflán** (una esquina cortada a 45°), nunca redondeadas: casa con las letras cuadradas y
   con las etiquetas náuticas. Chaflán estándar: 14 px en fichas y botones, 28 px en bloques grandes.
4. **Líneas antes que sombras.** Borde de 1 px (`--filete`), filete de 2 px bajo cabeceras, filete discontinuo para
   separar metadatos. Una sola sombra permitida: la del panel desplegado sobre el contenido.
5. **Los datos, en monoespaciada y en mayúsculas pequeñas con tracking:** número de proyecto, estado, fechas,
   coordenadas, tipo. Lo que se lee de corrido va en la serif.
6. **El celeste en bloques.** Cabecera de portada, cabeceras de sección destacadas y el fondo de la ficha de proyecto
   cuando no hay captura: celeste hondo plano con isobatas en blanco al 20-50 %.
7. **La retícula se ve.** Fondo de papel con cuadrícula de 24 px muy tenue. Los márgenes y los tamaños se alinean a ella.
8. **Estructura con sentido:** la numeración («Nº 04») es el `orden` real del proyecto; las coordenadas son las de
   un sitio real (Santiago, 42°52′N 8°33′W). Nada numerado por adorno.
9. **Movimiento mínimo:** la curva y los 200 ms actuales se mantienen; solo desplazamiento de 2-3 px al pasar y
   cambios de color. Nada que se mueva solo, salvo la animación del flujo, con su reposo para `prefers-reduced-motion`.
10. **Contraste AA sobre el celeste:** sobre `--celeste-hondo` el texto va en blanco; sobre `--celeste` claro solo
    van etiquetas grandes o el granito.
11. **Los diagramas siguen la misma hoja** (`docs/diagramas/*.svg`, exportados con `scripts/diagramas-webp.mjs`): papel con
    retícula, cajas blancas con chaflán y filete, títulos en Big Shoulders Display, etiquetas en JetBrains Mono, solo
    colores de la paleta (celeste hondo, alga y tinta-2 para las categorías; celeste para lo que pasa, tinta para lo
    rechazado) y nada de degradados. Ningún número que cambie cada semana (la cifra de pruebas va en la ficha).

## Tokens

Los nombres actuales de `global.css` se conservan donde coinciden; los nuevos se añaden; `--brillo` y `--sombra`
desaparecen (la segunda queda solo para el panel).

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--celeste` | `#1aa6df` | `#1aa6df` | Marca, enlaces, estado «publicado» |
| `--celeste-hondo` | `#0072a8` | `#0b5e88` | Bloques grandes de color |
| `--papel` (`--fondo`) | `#fbfcfd` | `#0d171e` | Fondo de página |
| `--reticula` | `#e3edf3` | `#16242e` | Cuadrícula de 24 px |
| `--superficie` | `#ffffff` | `#111f29` | Fichas y paneles |
| `--filete` (`--borde`) | `#b9cbd6` | `#2b3d49` | Bordes y líneas |
| `--tinta` (`--texto`) | `#13212b` | `#e6eef3` | Texto; gris granito con sesgo azul |
| `--tinta-2` (`--texto-2`) | `#4a5c69` | `#9fb2bf` | Texto secundario y datos |
| `--alga` | `#5d7a6a` | `#8fb09e` | Acento secundario: «en desarrollo», avisos suaves |
| `--chaflan` / `--chaflan-grande` | `14px` / `28px` | igual | Esquina cortada |
| `--curva`, `--transicion`, escala `--z-*` | como ahora | | Sin cambios |

Chaflán en CSS: `clip-path: polygon(0 0, calc(100% - var(--chaflan)) 0, 100% var(--chaflan), 100% 100%, 0 100%)`.

### Tipografía

Tres papeles: **títulos** (condensada o cuadrada, mayúsculas, tracking corto), **texto** (serif sobria) y **datos**
(monoespaciada). Candidatas, todas con licencia OFL y paquete `@fontsource` (comprobado en npm el 2026-11-08):

| | Títulos | Texto | Datos |
|---|---|---|---|
| A | Barlow Condensed 600/700 | Source Serif 4 400/600 | IBM Plex Mono 400/500 |
| **B (elegida)** | Big Shoulders Display 700/800 | Literata 400/600 | JetBrains Mono 400/500 |
| C | IBM Plex Sans Condensed 500/700 | IBM Plex Serif 400/600 | IBM Plex Mono 400/500 |

Decisión de la persona: **B** (2026-11-08, «Tipografia b»); en el código, `--fuente-titulos`, `--fuente-texto` y
`--fuente-datos` de `src/estilos/global.css` (paquetes `@fontsource-variable/*`). Escala: texto 17 px / 1.6; datos 12 px con tracking `.04em`; h3 32 px, h2 36 px,
h1 `clamp(44px, 9vw, 96px)` con interlineado 1.02 (más apretado monta las cajas de color; visto en el prototipo).

## Recursos de imagen para el generador (Galivelop IG)

Se generan en local, así que la lista es larga a propósito; lo que manda es la calidad y que todo salga de la misma
familia. Mientras no existan, la web usa el sustituto de la columna «Hasta entonces». Cada recurso entregado se apunta
aquí con fecha y ruta.

### Dónde va cada recurso

Al recibir una imagen, se copia a su destino y se ejecuta la orden. Los números son los de las tablas de abajo; los nombres de archivo que no fija otro sitio (`rosa-vientos.svg`, `sello.svg`, `gv-logo-negativo.svg`, los de `iconos/`) son la propuesta: se puede cambiar al recibirlos.

| # | Destino | Orden |
|---|---|---|
| 1 | `public/marca/gv-logo.svg` y `public/marca/gv-logo-512.png` (favicon 32 y `apple-touch-icon` 180 en `public/marca/`) | Vectorizar el PNG de 1024 px a SVG; exportar el PNG de 512 |
| 1b | `public/marca/gv-logo-negativo.svg` | Vectorizar |
| 2 | `public/marca/isobatas.svg` (sustituye a las provisionales de `scripts/isobatas-provisionales.py`) | Copiar; quitar o dejar de usar el script provisional |
| 3 | `public/marca/galivelop-portal.jpg` (1200×630, referenciada en `index.html`) | Copiar y comprobar la referencia de `og:image` |
| 4, 5 | `public/marca/rosa-vientos.svg`, `public/marca/sello.svg` | Vectorizar |
| 6 | `public/proyectos/<slug>/portada.webp` (+ `portada-mini.webp`) | Convertir a WebP, grande y `-mini` |
| 7, 8, 9, 14 | `public/marca/iconos/<nombre>.svg` | Vectorizar la hoja y recortar cada icono (trazo uniforme, `currentColor`) |
| 10, 11, 13, 16, 18, 19, 21, 22 | `public/marca/<nombre>.webp` (+ `-mini.webp`) | Convertir a WebP; el tema oscuro, aparte si va sobre papel |
| 12, 17, 20 | `public/marca/<nombre>.svg` | Vectorizar |
| 15 | Decidir al recibirlo: las entradas de «Próximamente» aún no tienen carpeta en `public/proyectos/` | Convertir a WebP |
| 23 | `public/proyectos/<slug>/icono.png`, el `icono` de la ficha | Copiar a 512×512 |
| 24 | `public/proyectos/<slug>/og-fuente.png` | `python3 tools/og/generar.py` genera el `og.jpg`; `src/data/og.test.ts` comprueba la huella |

La vista previa (`og`) de un proyecto es siempre `og-fuente.png` + `python3 tools/og/generar.py`, nunca el `og.jpg` a mano.

### Cómo pedirlas

- **Un solo estilo para todo:** cada prompt termina con el bloque común de abajo. Si el generador admite imagen de
  referencia, la primera pieza aprobada (la portada social, nº 3) se pasa como referencia a todas las demás.
- **Sin texto** en ninguna imagen: el texto lo pone la web en los tres idiomas. Tampoco banderas ni cruces de Santiago.
- **Dos fondos:** sobre **celeste hondo** (`#0072a8`) con líneas blancas, o sobre **papel** (`#fbfcfd`) con líneas
  gris granito (`#13212b`). Cada prompt dice cuál. Lo que va sobre papel se pide también en versión para el tema
  oscuro (líneas claras `#e6eef3` sobre `#0d171e`) o, mejor, en SVG, que se colorea por CSS.
- **Formatos:** fotos/ilustraciones de fondo en WebP, grande + `-mini` como en
  [`desarrollo.md`](desarrollo.md#añadir-o-actualizar-un-proyecto). Iconos y marcos: PNG con transparencia a 1024 px,
  que se vectorizan aquí a SVG (trazo uniforme, sin relleno), para colorearlos con `currentColor`.
- **Pedir en serie, no de uno en uno:** los iconos como hoja de contactos (una cuadrícula con 6-8 por imagen) para que
  compartan trazo; las portadas por estado en la misma sesión con la misma semilla.
- **Qué no pedir:** personas (las fotos del equipo son reales), capturas o ilustraciones de un proyecto (viven en su
  propio repo y entran por su ficha), nada con degradado, resplandor o esquina redonda.

**Bloque de estilo común (al final de cada prompt):**
> Flat vector illustration, nautical chart aesthetic, thin lines of even width, no gradients, no glow, no shading,
> no text, no letters, no watermark, sharp 45-degree cut corners instead of rounded corners, lots of empty space,
> minimal, technical, serene. Palette strictly limited to sky blue #0072a8, off-white #fbfcfd, ink grey #13212b and
> a touch of seaweed green #5d7a6a.

**Negativo (si el generador lo admite):** `text, letters, watermark, gradient, glow, bokeh, rounded corners, 3d,
photo, realistic water, waves, seagulls, flag, people`.

### A. Marca (prioridad 1)

| # | Recurso | Medidas y forma | Dónde va | Hasta entonces | Prompt |
|---|---|---|---|---|---|
| 1 | **Logo** | Cuadrado; fondo celeste plano con chaflán de 28/128 en la esquina superior derecha; monograma GV blanco, trazo 12/128. Entregas: 1024 px PNG para vectorizar; de ahí SVG, 512 PNG, favicon 32 y `apple-touch-icon` 180 | `public/marca/gv-logo.svg`, cabecera, favicon | Logo actual con fondo plano y chaflán (prototipo) | "Monogram logo: the letters G and V joined by one shared horizontal stroke, white strokes of even width on a solid sky-blue square with the top-right corner cut at 45 degrees, geometric, inspired by port signage" + bloque |
| 1b | **Logo en negativo** | Igual, monograma gris granito sobre papel y versión monograma blanco sin fondo | Pie de página, tema oscuro, sellos | Ninguno | Mismo prompt, "ink grey strokes on off-white, no background square" |
| 2 | **Isobatas de la costa gallega** | SVG 2400×1200, solo líneas, 12-16 niveles, cada quinta más gruesa; recortes para portada (panorámico), ficha (16:9) y fondo de tarjeta (1:1) | Fondo del bloque de portada, fichas sin captura, pie | Isobatas de ruido (prototipo) | **No es del generador:** datos EMODnet DTM (CC BY 4.0) + `gdal_contour` (`investigacion/estilo-marca.md` §4) |
| 3 | **Portada social del portal** (`og:image`) | 1200×630, zona segura central 1000×500 vacía | `index.html`, `public/marca/galivelop-portal.jpg` | La actual | "Wide banner: bathymetric chart of the Galician Atlantic coast, white depth contours on solid sky blue, a small ink-grey compass rose in the bottom-left corner, the centre left empty" + bloque |
| 4 | **Rosa de los vientos** | SVG 256×256, 8 puntas, trazo fino, chaflán en el marco | Pie de página, página 404, marca de agua del muro | Nada | "Compass rose with eight points, thin even strokes, inside a square frame with one 45-degree cut corner, ink grey on transparent" + bloque |
| 5 | **Sello del taller** | SVG 320×320 circular con dos anillos de marcas de grados y el monograma en el centro (sin texto) | Junto a «Cómo trabajamos», pie, marca de agua de imágenes del muro | Nada | "Round technical stamp: two concentric rings with degree tick marks like a chart border, the G and V monogram in the centre, thin ink-grey strokes on transparent" + bloque |

### B. Portada y secciones (prioridad 2)

| # | Recurso | Medidas y forma | Dónde va | Hasta entonces | Prompt |
|---|---|---|---|---|---|
| 6 | **Portada de proyecto por estado** (3) | 1600×900 y `-mini` 720×405, sobre celeste hondo con isobatas al fondo | Fichas y tarjetas con `cabecera: "color"` o sin imagen (hoy Galivelop-workflow e IG) | Celeste plano con isobatas | «desarrollo»: "A workbench seen from above on a chart: calipers, a pencil, a half-drawn blueprint, white lines on sky blue" / «diseno»: "An empty sea chart with only the coordinate grid, a ruler and a drafting compass" / «publicado»: "A lighthouse beam drawn as thin concentric contour arcs across the sea" + bloque |
| 7 | **Iconos de las 4 líneas de trabajo** | Hoja 2×2 a 1024 px, cada icono en cuadrado con chaflán, trazo 2/48 | Inicio, «Líneas de trabajo» (`lineas.ts`) | Iconos actuales de `Inicio.tsx` | «Mundos que viven solos»: "a small island with its own weather system drawn as contour lines" · «Información verificable»: "a magnifying lens over a chart with a checkmark tick" · «Del prototipo al producto»: "a paper boat becoming a hull blueprint" · «Método de trabajo con IA»: "a sextant whose index arm is a pencil" + "line icon set, 2px even stroke, square grid" + bloque |
| 8 | **Iconos de los 4 valores** («Cómo trabajamos») | Igual que 7 | Inicio, `PRINCIPIOS` | Iconos actuales | «Problemas que importan»: "an anchor set into rock" · «Límite de lo que sabemos»: "the edge of a chart where the depth soundings stop" · «Enseñamos el proceso»: "an open logbook with a route drawn step by step" · «Aprendemos con generosidad»: "two mooring lines tied in one knot" + mismo pie que 7 |
| 9 | **Iconos de las 3 vías de participación** | Hoja 1×3 a 1024 px | Inicio «Participa», `/unirse`, `/proponer` | Sin icono | «Colabora»: "two oars crossed" · «Propón»: "a message bottle drawn as a blueprint" · «Aprende»: "a buoy with a small lantern" + pie de 7 |
| 10 | **Ilustración «Cómo funciona»** | 1600×600 panorámica sobre papel, una ruta trazada con 4 puntos numerables (los números los pone la web) | Sección de pasos de `/unirse` | Lista sin imagen | "A route plotted on a chart with four waypoints joined by a dashed line, each waypoint an empty circle, small depth soundings around, ink grey on off-white" + bloque |
| 11 | **Fondo de «Es para ti si…»** | 1200×1200 sobre papel, muy tenue (se pondrá al 30 %) | Detrás de la lista de `/unirse` | Papel liso | "Faint chart detail: a ría estuary coastline with soundings and a few contour lines, very light ink grey on off-white" + bloque |
| 12 | **Separador de sección** | SVG 1200×24, línea que se vuelve costa un tramo | Entre bloques largos de la portada | Filete 1 px | "A single thin horizontal line that for a short stretch becomes a stylised coastline with rías, ink grey on transparent" + bloque |

### C. Páginas interiores (prioridad 3)

| # | Recurso | Medidas y forma | Dónde va | Hasta entonces | Prompt |
|---|---|---|---|---|---|
| 13 | **Cabecera de Productos** | 1600×500 sobre celeste hondo | Arriba de `/productos` | Bloque celeste con isobatas | "A harbour seen in plan view like a port chart: quays, berths and a breakwater as thin white lines on sky blue, a few moored hull outlines" + bloque |
| 14 | **Icono de producto «implantación y servicio»** | SVG 48×48 | Tarjetas de producto (`TarjetaProducto`) | Sin icono | "A crane hook lowering a container onto a quay, line icon" + pie de 7 |
| 15 | **Tarjetas «Próximamente»** (2) | 1200×675 y `-mini`, sobre celeste hondo, con hueco limpio en el tercio inferior | `TarjetaProxima` (hoy Voice Generator y Developer) | Celeste plano | Voz: "a sound wave drawn as a single depth profile line of the seabed" · Developer: "a keel laid on blocks in dry dock, plan view, white lines on sky blue" + bloque |
| 16 | **Cabecera del Muro** | 1600×400 sobre papel | Arriba de `/muro` | Sin cabecera | "A long notice board drawn as a chart margin: pinned blank cards with cut corners, thin ink-grey lines on off-white" + bloque |
| 17 | **Marco de retrato del equipo** | SVG 400×400, borde con marcas de grados y chaflán; la foto va dentro | `/equipo` y página de cada miembro | Borde 1 px | "Square picture frame drawn like the border of a nautical chart: tick marks with degrees along the edges, top-right corner cut at 45 degrees, ink grey on transparent, empty inside" + bloque |
| 18 | **Ilustración de la página 404** | 1200×800 sobre papel | `NoEncontrado.tsx` | Solo texto | "A chart with the words area left blank, a dashed route that ends in open water with a question-shaped buoy, ink grey on off-white" + bloque (sin letras: la boya solo sugiere la forma) |
| 19 | **Estado «enviado» de los formularios** | 800×600 sobre papel | `form.listo` en `/proponer` y `/unirse` | Solo texto | "A paper boat leaving a quay, its wake drawn as three thin lines, ink grey on off-white" + bloque |
| 20 | **Cabecera de páginas legales** | SVG 1200×80 sobre papel | `/aviso-legal`, `/privacidad`, `/terminos` | Nada | "A thin chart title-block border: a rectangle with inner rules and small corner marks, ink grey on transparent" + bloque |
| 21 | **Patrón de fondo del pie** | 1200×300 repetible en horizontal, celeste hondo | `Pie.tsx` | Celeste plano | "Seamless horizontal strip of bathymetric contour lines, white on sky blue, tileable left to right" + bloque |
| 22 | **Textura de papel** (opcional) | 512×512 repetible, grano casi invisible | Fondo de página bajo la retícula | Color plano | "Seamless tileable fine paper grain texture, almost white, extremely subtle" + bloque (sin la parte azul) |

### D. Por proyecto (cuando se toque su ficha)

| # | Recurso | Medidas y forma | Dónde va | Hasta entonces | Prompt |
|---|---|---|---|---|---|
| 23 | **Icono de proyecto** para los que no tienen (Tarkor, Galivelop-workflow) | 512×512, cuadrado con chaflán, símbolo blanco sobre celeste | `icono` de la ficha, `MenuProyectos` | Inicial del nombre | Tarkor: "a pocket world: a small round map with a crown-shaped mountain, white lines on sky blue" · Workflow: "a relay baton drawn as a chart pencil passing between two hands as outlines" + bloque |
| 24 | **`og.jpg` por proyecto** en el mismo estilo | 1200×630, tercio izquierdo con hueco para el icono del proyecto | `public/proyectos/<slug>/og.jpg` | Los actuales | Mismo prompt que 3 con el motivo del proyecto en vez de la rosa de los vientos |

Orden de trabajo: A entera, luego 6-9 (son los que más se ven), luego el resto de B y C según se vaya aplicando la hoja.

## Pasos para aplicarlo

1. Elegir la tipografía (persona). Instalar los tres paquetes `@fontsource` y quitar Inter y Sora.
2. Reescribir `:root` de `global.css` con los tokens de arriba y el claro por defecto; sustituir `border-radius` por
   chaflán donde proceda; retirar `--brillo`, degradados y `backdrop-filter`.
3. Generar las isobatas reales (recurso 2) y el logo (recurso 1).
4. Revisar en móvil y escritorio, con capturas antes/después; `npm run check` y `npm run build`.
5. Cambio grande: fase 1 (`/code-review`), fase 2 (`gw-opt-tokens`, `retro`, `gw-seo` por la `og:image`) y fase 3 antes
   de que la tarea semanal lo publique.
