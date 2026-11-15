# Seis auditorías del portal · 2026-11-15

Pedidas por la persona: estilos, responsive y adaptativa, deuda técnica, limpieza, tiempos, y accesibilidad y
experiencia de usuario. Rama `ccr-5c066d81-ndsd13`, sobre `45823a6` y un `npm run build` fresco. Seis subagentes
`sonnet` de solo lectura; no partían de cero: lo arreglado tras la [auditoría del 2026-11-14](auditoria-2026-11-14.md)
no se repite y lo que seguía abierto se marca «sigue pendiente». Nada de esto está arreglado todavía.

## Veredicto

**Ningún hallazgo grave de cara a quien visita la web.** Sin scroll horizontal ni errores de JS de 320 a 1920 px, axe
sin fallos graves en 96 vistas, repo muy limpio (sin archivos de `src/` huérfanos, sin TODO, sin enlaces rotos en docs).
Lo grave está por dentro: **CLS del paso del prerender a React**, **213 KB de iconos SVG en el bundle inicial** y
**varias fuentes de verdad** (títulos y rutas) en un prerender sin tests.

| Auditoría | Grave | Medio | Leve |
|---|---|---|---|
| Estilos | 0 | 7 | 12 |
| Responsive y adaptativa | 0 | 3 | 9 |
| Deuda técnica | 3 | 10 | 9 |
| Limpieza | 1 alto (consultar) | 2 | 7 |
| Tiempos | 2 | 6 | varios |
| Accesibilidad y UX | 0 | 6 | 12 |

Métricas medidas (móvil 390 px, 1,6 Mbit/s, CPU ×4): inicio LCP 2,63 s y CLS 0,051; ficha de Tarkor LCP 4,15 s y
CLS 0,122; toVeriAI CLS 0,149. `npm run check` ~31 s, el 80 % en `test-ganchos.sh`.

## Propuesta de bloques (por impacto y coste)

1. **Rendimiento de carga:** `hydrateRoot` con el mismo marcado del prerender (o stub de la misma altura); iconos de
   marca re-vectorizados o cargados por página; LCP sin depender del JS (`fetchpriority`, `width/height`);
   `modulepreload` por ruta; preload de 2 fuentes; adelgazar `isobatas.svg`.
2. **Adaptación al dispositivo:** `@media (hover: hover)` para los ~50 `:hover`; `prefers-color-scheme` sin tema
   guardado y `theme-color` por tema; `viewport-fit=cover`; `forced-colors`/`prefers-contrast`; `min-width: 0` en
   hero y `.campo` (zoom 200 %); cabecera estática en móvil apaisado; 44 px con `pointer: coarse`.
3. **Accesibilidad y UX:** orden del menú móvil en el DOM (A1); obligatorios marcados y ayuda fuera del `label` (A4);
   anuncios de filtros, hoja de apartados y envío de formulario (A2, A3, A5); `aside` anidados; idioma inicial por
   `navigator.language` (U1, decisión de la persona); texto en el suspense.
4. **Estilos:** decidir `--chaflan`/`.chaflan` (doc u hoja); tamaños < 12 px; escala de tipos y tokens de espaciado;
   opacidades y velos como tokens; `--celeste` en iconos informativos → `--acento-texto`.
5. **Deuda:** una sola fuente para títulos y rutas (`tituloDe`, tabla de rutas); prerender con comprobación de cada
   reemplazo y test; jsdom + testing-library; ESLint con `react-hooks`; Galeria fuera de rango; actions por SHA.
6. **Limpieza (bajo riesgo):** `scripts/isobatas-provisionales.py`, `buscarProducto`, claves i18n `sec.descripcion`,
   `contacto.github`, `contacto.correo`, exports sin uso, rutas viejas en 3 docs. **Consultar:** 8 webp de workflow
   sin referencia en `public/` (publicados, ~392 KB) y si `docs/media/` (11 MB) debe seguir en git.

Fuera del portal: `test-ganchos.sh` lanza ~788 procesos `python3` (213 `config.py get`); el arreglo de fondo va al
repo del flujo.

No comprobado: Safari, Firefox, dispositivo real y lector de pantalla real (a cargo de la persona).


---

## Auditoría de estilos · Portal-Galivelop · 2026-11-15 (solo lectura)

Alcance: `src/estilos/global.css` (5929 líneas, la única hoja `.css` de `src/`), `marca.test.ts`, `clases.test.ts`, `docs/marca.md`.
Método: análisis con scripts (tokens definidos/usados, clases sin uso, duplicados, especificidad, valores sueltos) y lectura de los puntos dudosos.

Lo que está bien (no se repite como hallazgo): los 80+ tokens están todos definidos y todos se usan (ninguno huérfano ni sin definir en el CSS);
no hay selectores duplicados de primer nivel; solo 3 `!important` (todos en `prefers-reduced-motion`); las 22 clases «sin uso» son dinámicas
(`estado-${x}`, `collage-${i}`, …) y `clases.test.ts` ya vigila las muertas; no hay `backdrop-filter`, degradados de fondo ni sombras difusas
salvo la del panel; solo hay 1 `border-radius` (el punto de estado, permitido y marcado); `z-index` de la escala salvo 4 capas locales (0, -1, -2).
Foco, contraste de campos y menú ya arreglados el 2026-11-14 (no se repiten).

### Estado de lo pendiente de la auditoría previa
- «El tema no sigue `prefers-color-scheme` sin tema guardado; sin CSS para `forced-colors` ni `prefers-contrast`»: **sigue pendiente** (0 apariciones en la hoja).
- «Celdas huérfanas en rejillas, safe areas»: **sigue pendiente** (no hay `env(safe-area-inset-*)`; no comprobado lo de las rejillas).
- Imágenes sin `srcset`: fuera de alcance de estilos.

---

### GRAVES
Ninguno. (Nada rompe la marca ni la accesibilidad de forma visible; lo más cercano está en «medio».)

### MEDIOS

#### M1 · `docs/marca.md` y `global.css` no coinciden en el chaflán de las fichas
- `src/estilos/global.css:24-26` y `docs/marca.md` (regla 3 y tabla de tokens). El doc define `--chaflan: 14px` «fichas», una clase `.chaflan` y la receta
  `clip-path: polygon(0 0, calc(100% - var(--chaflan)) 0, …)`. En la hoja **no existe `--chaflan` ni `.chaflan`** (el comentario de la línea 24 aún los nombra);
  solo `--chaflan-grande` (usado 1 vez, `.collage-0`, línea 813-818) y `--chaflan-pequeno` (1 vez, `.boton`, línea 483-489). Las tarjetas, paneles, cajas y cabeceras
  son rectangulares con filete. Hay además un tercer chaflán a mano: `.retrato > *` con `polygon(0 0, 90% 0, 100% 10%, …)` (línea 3350).
- Arreglo: decidir cuál es la verdad. Si las fichas llevan chaflán, añadir `--chaflan` y una clase/mixin y aplicarlo a `.tarjeta` & co.; si no, corregir `marca.md`
  (regla 3, tabla de tokens) y el comentario de la línea 24, y pasar el 90 %/10 % del retrato a una variable.
- Esfuerzo: S (corregir docs) / M (aplicar el chaflán).

#### M2 · Datos por debajo del mínimo de la propia marca (12 px) y sin escala de tamaños
- `global.css`: 361 (`.idiomas button` 0.72rem), 572 (`.chips li` 0.7rem), 600 (`.estado` 0.7rem), 2134, 2504, 4021, 4332, 4398, 5474 (0.75rem), 2579, 1709, 4162 (0.78rem),
  3791 (`.icono-tec-monograma` **0.6rem = 9,6 px**), 4170 (0.7rem). `--datos` fija 0.75rem (12 px) y `docs/marca.md` dice «datos 12 px».
- Además hay ~45 valores distintos de `font-size` (0.6rem … 2.25rem y `px` sueltos, p. ej. 0.9/0.85/0.92/0.88/0.93/0.95/0.97/0.98/1.02/1.05/1.08/1.1/1.15/1.2/1.25/1.3/1.35/1.4 rem). La marca
  solo define texto 17 px, datos 12 px, h1/h2/h3 y h4 1.35rem; no hay escala. Sube el coste de mantenimiento y desvía el ritmo tipográfico.
- Arreglo: subir los datos a ≥ 0.75rem (el monograma a 0.7rem como mínimo, con la caja a 16 px) y definir una escala corta de tokens (`--t-datos`, `--t-s`, `--t-m`, `--t-l`… 6-8 pasos),
  luego sustituir por aproximación. Añadir al `marca.test.ts` una comprobación de `font-size` fuera de la escala (con el mismo mecanismo de `marca: permitido`).
- Esfuerzo: L (sustitución completa), S (solo el mínimo de 12 px).

#### M3 · Sin tokens de espaciado y fuera de la retícula de 24 px
- Regla 7 de la marca: «los márgenes y los tamaños se alinean a [la retícula]». En la hoja, `padding/margin/gap` usan 8 (76×), 12 (57×), **14 (54×)**, 10 (48×), 16 (46×), **6 (45×)**, 4, 20, 24 (34×), 18 (26×), 22, 26, 28, 5, 7, 9, 11…
  Solo 24, 48, 72, 96 están en la retícula. No hay `--espacio-*`; el único token de longitud estructural es `--ancho`.
- Arreglo: definir una escala base-4/8 (`--e-1: 4px … --e-6: 24px, --e-8: 48px`) y migrar de forma gradual; el 14/18/22/26/5/7/9/11 sobran. No hace falta que todo sea múltiplo de 24, pero sí decir
  en `marca.md` que la regla 7 se refiere a la retícula del fondo y al ritmo vertical de las secciones.
- Esfuerzo: L.

#### M4 · Hover sin su par de teclado (solo hay 4 `:focus-visible` frente a 50 `:hover`)
- `global.css` 338, 390, 496, 899, 1371, 1554, 1696, 2204, 2783, 3218, 3269, 3649, 4336, 5004, 5081, 5264, 5404, 5677, 5902 (y otros). El foco visible lo da el `:focus-visible` global (222-225) y por eso no es un fallo de WCAG,
  pero el realce (cambio de borde/color, `translateY`, flecha que se desliza) solo existe con ratón. Solo `.tarjeta` (954) lleva `:focus-within`, `.boton` tiene `:focus-visible` propio (502).
  `.mosaico-pieza`, `.via`, `.chip-enlace`, `.discord`, `.hoja-siguiente`, `.galeria-flecha` y `.enlace-flecha` no replican el estado.
- Además `:active` solo existe en `.boton*` (508-510), `:disabled` solo en `.flujo-boton` (4468) y no hay `@media (hover: hover)`: en táctil el `:hover` se queda pegado tras el toque (afecta a los `translateY` y cambios de borde).
- Arreglo: agrupar `selector:hover, selector:focus-visible` en los componentes con realce propio; envolver los desplazamientos/ cambios de fondo en `@media (hover: hover)`; añadir `:active` ligero en botones del visor y chips.
- Esfuerzo: M.

#### M5 · Opacidades de blanco sin token (≥ 12 valores distintos)
- `global.css` 670, 716, 731, 743, 764, 1547, 1559, 1579, 1592, 1607, 1608, 1712, 1716, 1727, 1745, 1803, 1935, 2442, 2563-2569, 2600: `rgb(255 255 255 / 0.06 | 0.12 | 0.2 | 0.3 | 0.35 | 0.4 | 0.6 | 0.7 | 0.82 | 0.85 | 0.92 | 0.94)` y `rgb(0 0 0 / 0.12 | 0.22)`.
  El test lo admite (blanco/negro con transparencia), pero acaban siendo un tercer sistema de color encima de los tokens y los textos sobre celeste (0.82-0.94) no están comprobados por contraste en ningún sitio.
- Arreglo: tokens `--sobre-bloque` (texto 0.92), `--sobre-bloque-2` (0.78), `--filete-sobre-bloque` (0.3) y `--velo-claro` (0.12); reducir a 4-5 valores y verificar AA del texto de 0.82.
- Esfuerzo: M.

#### M6 · Dos «noches» distintas en los velos, y el doc dice otra cosa
- `global.css:8-10` define `--velo*` con `rgb(6 18 28 / …)`, `--noche: #03090f` (3 9 15) y `--tinta: #13212b` (19 33 43). `docs/marca.md` dice «`--velo`: tinta al 62/68/78 %» (no lo es: 6 18 28 no es la tinta).
  Además `1937` (`rgb(3 9 15 / 0.78)`, mismo 78 % que `--velo-denso`) y `5332` (`.hoja::backdrop`, `rgb(3 9 15 / 0.7)`) escriben la noche a mano y no usan los tokens de velo.
- Arreglo: derivar los tres velos de `--noche` (o de `--tinta`) con `color-mix`/`rgb(from …)` y usarlos en 1937 y 5332; corregir la fila del doc.
- Esfuerzo: S.

#### M7 · `--celeste` (2,8:1) usado como color de icono sobre el papel
- `global.css` 1269 (`.valores svg`), 2624 (`.via > svg`), 3040 (`.lineas > li > svg`), 3124 (`.lista-check svg`, un ✓ que informa), 3939 (`.proyecto-propio-icono`), 3978 (`.persona-hueco`), 2101 (`.hito-marca`).
  Docs: «`--celeste`: nunca texto sobre papel claro». Son iconos (WCAG 1.4.11 pide 3:1 si transmiten información, p. ej. el ✓ de lista y la marca de hito hecho) y sobre `--tinte` (celeste al 12 %) bajan algo más.
  En el oscuro funciona; en claro, 2,78:1.
- Arreglo: `color: var(--acento-texto)` (hondo en claro) para los iconos informativos; dejar `--celeste` solo para decorativos. Idem el «Gali» del logo (exento).
- Esfuerzo: S.

### LEVES

#### L1 · Tres variantes de «volver» y bloque de icono de 44 px repetido 5 veces
- `.volver` (1544), `.volver-oscuro` (2837), `.miembro-volver` (3649): mismas ideas con colores distintos. Candidato a `.volver` + modificador (`--sobre-bloque` / `--papel`).
- `width/height: 44px; padding: 10px; color: var(--celeste); background: var(--tinte)` aparece en 1264, 2620, 3036, 3934, 3974: extraer `.icono-caja`.
- Esfuerzo: S-M.

#### L2 · Condición de tema inconsistente
- Se mezclan `:root[data-tema='claro']`, `:root:not([data-tema='claro'])` (1096, 1398, 2398, 2702-2703, 2734, 2756, 3778) y `:root[data-tema='oscuro']` (83, 132, 4714). Funciona (el atributo siempre existe por `index.html`),
  pero si algún día aparece un tercer valor (`auto`, contraste alto) las dos formas divergen. Además la mitad de los casos se resuelven con `filter: invert(1) hue-rotate(180deg)` (1097, 2704), que fabrica los colores de un recurso y no los controla (tokens de marca).
- Arreglo: unificar en `:root[data-tema='oscuro']`; para separador, rosa y sello, versión SVG para oscuro o `currentColor`/máscara con token. Esfuerzo: M.

#### L3 · Falta el modo automático, alto contraste y colores forzados (sigue pendiente de 2026-11-14)
- 0 `prefers-color-scheme`, 0 `forced-colors`, 0 `prefers-contrast`, 0 `@media print`. `Tema.test.ts` solo comprueba los dos temas manuales.
- Arreglo: resolver el tema inicial por `prefers-color-scheme` en el script del `index.html` (sin tocar CSS) y añadir un bloque corto `@media (forced-colors: active)` para `.boton`, `.estado-punto` y `.barra` (que dependen de fondos). Esfuerzo: M.

#### L4 · `prefers-reduced-motion` con `!important` y barra de la galería
- `global.css:245-248`: `animation-duration: 0ms !important` deja `galeria-avance` (1753, `animation: … forwards`) en el estado final al instante: la barra de progreso aparece llena. Mejor `animation: none` para las barras de progreso y que la sesión de JS controle el avance. Los otros 2 `!important` (4796) son equivalentes y aceptables. Esfuerzo: S.

#### L5 · Duraciones sueltas
- Fuera de `--transicion` (200 ms): 400 ms (766, 4893), 500 ms (4557, 4711), 600 ms (970), 900 ms (776, 784) y `350ms` (1785). La regla 9 dice «los 200 ms actuales se mantienen» (se asume que los largos son de imagen/escena, pero no están marcados).
- Arreglo: `--transicion-lenta` (400 ms) y comentar las de escena; opcionalmente permitir en `marca.test.ts` solo duraciones de tokens. Esfuerzo: S.

#### L6 · Especificidad/Selectores frágiles
- `:has()` con hover compuesto: 2778 (`.vias li:has(.via:hover)`), 3993-3997 (`.equipo > li:has(.equipo-enlace:hover)`), 2207; `.flujo-svg .a.cae.on` (4568); y las clases de escena del flujo son de una letra (`.a .mf .so .sn .ti .tm .su .lb .tx .nm .ck .ckb .xb .ret`, 4520-4780): ilegibles para quien no tenga el componente delante.
- Arreglo: comentar un glosario arriba del bloque o renombrar (`.flujo-nodo`, `.flujo-paso`…). Esfuerzo: M.

#### L7 · Tamaños y capas a mano
- `scroll-padding-top: 88px` (html, ~línea 160) hardcoded respecto a la altura de la cabecera; `width: 280px/116px/460px` (1321, 1869, ~4091); varios `max-width` en `ch` (48-76) sin escala; `z-index: 0 / -1 / -2` (1318, 1519, 1527, 2418) fuera de la escala `--z-*`. `.flujo-svg` usa `font-size` en px (24, 16, 15, 17, 44, 20, 40, 22, 13, 26, 30, 4737-4776), correcto en unidades de `viewBox` pero conviene comentarlo.
- Arreglo: `--alto-cabecera` y `--z-fondo`/`--z-bajo`. Esfuerzo: S.

#### L8 · Bordes duplicados y declaraciones redundantes
- `.miembro-cabecera` declara `border: 1px solid var(--borde)` dos veces (3660-3668). `.hoja:focus, .hoja:focus-visible` (5326) sin foco visible: es un `<dialog>`; ok, pero conviene dejarlo comentado. `.boton-cristal` (2561) es un nombre heredado: «cristal» contradice la regla 2 (nada de vidrio) aunque el estilo es plano; renombrar a `.boton-sobre-bloque`.
- Esfuerzo: S.

#### L9 · Tokens usados una sola vez y alias redundantes
- Usados 1 vez: `--ancho`, `--foco` (con 4 sobrescrituras), `--estado-desarrollo`, `--estado-publicado`, `--peligro-tinte`, `--sobre-peligro`, `--velo`, `--velo-medio`, `--z-cabecera`, `--z-enlace`, `--z-nav-ficha`, `--z-panel`, `--z-saltar`.
  Los de `z` y estado se justifican; `--velo` y `--velo-medio` casi no se distinguen (62 % vs 68 %): fusionar. Alias dobles: `--fondo/--papel`, `--borde/--filete`, `--texto/--tinta`, `--texto-2/--tinta-2`, `--celeste-intenso/--celeste-hondo`: la hoja usa los dos nombres según la zona.
- Arreglo: elegir un nombre (el de `marca.md`, p. ej. `--papel`, `--filete`, `--tinta`) y mantener el otro solo si lo usan las páginas de proyecto. Esfuerzo: M.

#### L10 · Monolito de 5929 líneas
- Todo el CSS está en `global.css`. Los hallazgos de duplicación (L1) y de orden se producen por esto. Partir por secciones (`@import` o varios archivos: tokens, base, cabecera/pie, tarjetas, proyecto, formularios, flujo) no cambia la salida y `marca.test.ts` ya recorre todas las hojas de `src/`. Esfuerzo: M. No urgente.

#### L11 · Tipografía: pesos y tracking sueltos
- `letter-spacing: 0.01em` (177, 203, 4608, 4631), `0.02em` (264, 4326), `0.03em` (4618) frente a `--datos-espaciado: 0.06em`; los títulos 0.01 em es el valor de la marca, el resto sobra. `font-weight: 600` (36 veces) es el valor más usado y la marca solo menciona 400/600 (texto), 700/800 (títulos), 400/500 (datos): con las variables está cargado, pero `.sobre-marca` usa título en 600 y `.hero-resumen dd` mezcla mono a 2rem/600 (748-752).
- Arreglo: tabla corta de pesos en `marca.md`; tokens `--tracking-titulo` y `--tracking-datos`. Esfuerzo: S.

#### L12 · Safe areas, `color-scheme` y barras
- Sin `env(safe-area-inset-*)` (cabecera sticky, `.hoja`, pie) — pendiente previo. `Tema.tsx:6` duplica en TS los colores de la barra del navegador (`#ffffff`/`#111f29` = `--superficie`) fuera de la hoja; un cambio de token no los arrastra. Esfuerzo: S.

---

### Resumen numérico
Graves 0 · Medios 7 · Leves 12.
Orden recomendado de ataque: M6, M7, M1 (S) → M4, M5 → L2/L3 → M2/M3 (migración larga, con una escala previa).

---

## Auditoría responsive y adaptativa · 2026-11-15

Medido con Playwright/Chromium sobre `dist/` (vite preview, base `/Portal-Galivelop/`), rutas: inicio, /proyectos/tarkor,
/novedades, /muro, /equipo, /equipo/alvaro-garcia-grana, /aviso-legal, /privacidad, /participa/proponer, 404; anchos
320, 375, 414, 768, 1024, 1280, 1440, 1920 y 667x375. Scripts en el scratchpad (`aud*.cjs`).

### Veredicto
Sin scroll horizontal en ninguna ruta/ancho, sin elementos desbordados ni cortados, sin imágenes deformadas
(`object-fit`/`aspect-ratio` correctos), sin errores de JS. Menú hamburguesa (<=1100 px) bien: abre a 320, 667x375 y 768,
con scroll interno. Con `prefers-reduced-motion` no queda ninguna animación infinita activa. Nada grave.
Lo arreglado el 2026-11-14 se mantiene (menú, foco, objetivos >=24 px, sticky en horizontal).

Solo en inicio, tres enlaces del pie miden 245x24, 77x24 y 73x24: con 24 px justos (mínimo WCAG 2.5.8 cumplido).

### Hallazgos

#### Medio
1. **Sin `@media (hover: hover)`: 50 reglas `:hover` se disparan con el toque en táctil** (sigue sin tratar; antes solo se
   arregló el submenú). Ej.: `.hero-collage:hover` (global.css:834) mueve las piezas al tocar y se queda "pegado";
   `.galeria-miniatura:hover` (1889), `.filtros button:hover` (899), `.chip-enlace:hover` (3077).
   Arreglo: envolver los `:hover` de efecto (transform, fondo) en `@media (hover: hover)`. Esfuerzo M.
2. **Sin `viewport-fit=cover`** (index.html:5 `width=device-width, initial-scale=1.0`): los `env(safe-area-inset-*)` de
   global.css:1933, 1942, 1946, 1963, 1964 (visor de la galería) son siempre 0 y la cabecera/pie no los usan. En iOS
   apaisado con notch el navegador reserva el hueco, así que no se rompe, pero el código de safe areas es inerte.
   Arreglo: añadir `viewport-fit=cover` y `padding-inline: env(safe-area-inset-*)` en `.contenedor`, cabecera y pie, o quitar
   el código muerto. Esfuerzo S/M. (sigue pendiente: "safe areas").
3. **El tema no sigue `prefers-color-scheme`** (global.css solo `color-scheme` fijo, líneas 46 y 84; `Tema.tsx` sin
   `matchMedia`). Probado con `colorScheme: dark` y sin tema guardado: sale claro (fondo rgb(251,252,253)).
   Además `<meta name="theme-color" content="#ffffff">` (index.html:8) es fijo y no cambia con el tema.
   Arreglo: leer `matchMedia('(prefers-color-scheme: dark)')` como valor inicial en `Tema.tsx` y dos `theme-color` con
   `media`. Esfuerzo M. (sigue pendiente).

#### Leve
4. **Hero a 200 % de texto en 320 px desborda (sw 354 > 320)**: `.hero-rejilla` (global.css:661) tiene
   `grid-template-columns: 1.1fr 1fr` y, en una columna, `.hero-texto` con `min-width:auto` crece hasta el contenido
   (410 px). Solo con el tamaño de fuente forzado al 200 % en 320 px (el zoom real del navegador a 640 px CSS no falla).
   Arreglo: `min-width: 0` en `.hero-texto` / `minmax(0,1fr)` en la versión de una columna. Esfuerzo S.
5. **/participa/proponer a 320 px con texto al 200 % desborda (sw 443)**: `.campos-fila` (global.css:2856) usa
   `minmax(min(100%,240px),1fr)` pero `.campo` (2863) es `display:grid` con `min-width:auto` y el input/etiqueta no se
   encoge. Arreglo: `.campo { min-width: 0 }` y `input {max-width:100%}`. Esfuerzo S.
6. **Zonas táctiles de 24-38 px** (44 recomendado) visibles: selector de idioma ES/GL/EN 31x24 (global.css:356, tiene
   `::after` de -10px que amplía la zona, así que solo se ve pequeño), botones tema/menú 38x38 (`.boton-icono`),
   `.tarjeta-enlace` 32 px de alto (1011), `.chip-enlace` 28 px (3065), filtros de /novedades 37 px (881), pestañas
   `.nav-ficha` 36 px, enlaces legales/pie 27-31 px, `.volver` 24 px (1542, con `::after`). Cumplen 2.5.8 (>=24).
   Arreglo: subir `.boton-icono`, `.filtros button`, `.chip-enlace` a `min-height:44px` en `pointer: coarse`.
   Esfuerzo S.
7. **Cabecera pegajosa ocupa ~69 px de 375 en móvil apaisado** (global.css:299 `position: sticky`, sin la regla
   `max-height:520px` que sí tiene `.nav-ficha`, 5028). Arreglo: `@media (max-height: 520px){ .cabecera{position:static} }`.
   Esfuerzo S.
8. **Sin `@media (pointer: coarse)` ni `any-hover`**: el único ajuste táctil está en JS (`Galeria.tsx:38`). Relacionado con 1.
   Esfuerzo S.
9. **Hero a 768 px**: columna única de 1180 px de alto (la rejilla de dos columnas empieza a 900 px, global.css:839) con
   mucho vacío; el collage ahora sí queda centrado (el "descentrado" de la auditoría previa parece resuelto: collage 124-644
   en 768). Arreglo: bajar el punto de corte a ~800 px o limitar el alto del collage. Esfuerzo S.
10. **Imágenes sin `srcset`** (sigue pendiente): `Apartados.tsx:74`, `Galeria.tsx:229`, `ImagenAmpliable.tsx:22`; el móvil
    descarga lo mismo que el escritorio. Esfuerzo M/L.
11. **Sin `forced-colors` ni `prefers-contrast`** (sigue pendiente). Esfuerzo M.
12. **1920 px**: el contenido queda en 1180 px centrado, sin problemas; no hay saltos raros entre puntos de corte
    (bloques 560/640/700/760/860/900/1000/1100 px: demasiados valores, mezclando em y px, pero sin fallos medidos).
    Esfuerzo de unificarlos: L, no urgente.

#### Comprobado y correcto
Tablas: no hay `<table>`. Galería: tira con scroll y snap, miniaturas dentro de contenedor `overflow-x:auto` (no
desborda la página ni a 640 px con zoom 200 %). Reduced motion: CSS global (global.css:240) y JS (`AnimacionFlujo.tsx:37`,
`Galeria.tsx:51`). Menú móvil: `max-height: 100dvh - 69px` con respaldo `vh` y `overscroll-behavior: contain`.
No medido: Safari/Firefox, dispositivo real, foco sobre visor.

### Capturas (solo problemas)
`responsive/`: `zoom200-320-inicio.png`,
`zoom200-320-participa_proponer.png`, `menu-*.png` y `hero-768.png` (referencia).

---

## Auditoría de deuda técnica — Portal-Galivelop (2026-11-15, solo lectura)

Ámbito: src/, scripts/, tools/vite, tools/qa, vite.config.ts, tsconfig.json, package.json, .github/workflows. `npx tsc --noEmit` limpio. Líneas aproximadas (el informe se redactó tras la exploración). No se repite lo ya apuntado en la bitácora salvo para priorizar.

Recuento: grave 3, medio 10, leve 9.

### Graves

#### G1. Varias fuentes de verdad para títulos de página y páginas fijas
- Dónde: scripts/paginas-estaticas.mjs (FIJAS), src/i18n/textos.ts, 11 `document.title` en src/pages (Equipo:15, Unirse:30, Novedades:32, Proyecto:193, Inicio:67, Miembro:58, Proponer:12, NoEncontrado:12, Muro:21, Legal:13).
- Problema: el título del prerender y el del cliente se escriben por separado y ya difieren (Proyecto). Cada página repite el cleanup a 'Galivelop'. Un cambio de texto exige tocar 3 sitios; el check no lo detecta.
- Arreglo: un único módulo `src/seo/titulos.ts` (función pura `tituloDe(ruta, idioma, datos)`) usado por las páginas (hook `useTitulo`) y por el prerender (importado desde TS compilado o duplicando vía vite-node). Test de paridad.
- Esfuerzo: M. Beneficio: elimina divergencia SEO y 11 efectos duplicados.

#### G2. scripts/paginas-estaticas.mjs (403 líneas) sin tipos ni tests, con reemplazos por regex que fallan en silencio
- Dónde: scripts/paginas-estaticas.mjs (reescritura de index.html por regex, ORG con correo y redes hardcodeado, `p.fecha ??=`, TIPO por slug, datos duplicados de src/data).
- Problema: si cambia index.html, el regex no casa y no se avisa; se publican páginas sin meta. Datos de la marca duplicados respecto a src/data. Es JS plano, fuera de tsc (include solo src, vite.config.ts, tools/vite).
- Arreglo: que cada `replace` verifique que casó (lanzar error si no); partir en módulos (plantilla, sitemap, jsonld, llms); `// @ts-check` o migrar a .ts; test sobre una salida de ejemplo; leer ORG de un único módulo de datos.
- Esfuerzo: M-L. Beneficio: evita regresiones SEO silenciosas.

#### G3. Tests que leen el fuente en lugar de comportamiento y sin cobertura de hooks ni prerender
- Dónde: src/components/accesibilidad.test.tsx:36-48, src/rutas.test.ts, src/components/Tema.test.ts, Enlace.test.ts, src/utils/ancla.test.ts, src/estilos/clases.test.ts, src/data/tonos.test.ts (y equipo/marca/legal tests parcialmente).
- Problema: afirman sobre el texto del código/CSS (regex sobre el archivo); se rompen al refactorizar sin que cambie el comportamiento y no detectan errores reales. Vitest en entorno node sin jsdom: no hay tests de hooks (`useFicha`, `useMovil`), ni de Galeria, ni del prerender.
- Arreglo: añadir jsdom/happy-dom y @testing-library/react; sustituir los tests de texto por renders; test de humo del prerender sobre un dist mínimo.
- Esfuerzo: L. Beneficio: red de seguridad real para refactorizar G4/M1.

### Medios

#### M1. Efectos secundarios en render y acoplamiento a internals del router
- Dónde: src/main.tsx (`window.onpopstate` asignado en render, history manipulado a mano con usr/key/idx del router, `createRoot` y no `hydrateRoot` aunque se prerenderiza); src/paginas.ts (`void cargarFicha`, `location.pathname` en render); src/data/proyectos.ts (`location.reload()` dentro de un efecto).
- Problema: frágil ante actualizaciones de react-router-dom 7; doble trabajo y parpadeo al no hidratar; recargas en bucle posibles.
- Arreglo: usar `basename` y `createBrowserRouter` por idioma, mover cargas a loaders o efectos; sustituir `reload()` por estado de error con botón de reintento; valorar hydrateRoot.
- Esfuerzo: M-L.

#### M2. Mapa de rutas duplicado entre src/App.tsx y src/paginas.ts, y lógica de idioma duplicada
- Dónde: App.tsx, paginas.ts, src/i18n/Idioma.tsx (`idiomaDeRuta`, `baseDeIdioma`), scripts/paginas-estaticas.mjs.
- Problema: alta de una ruta = tocar 3-4 sitios; rutas.test.ts lo compensa leyendo el fuente.
- Arreglo: tabla única de rutas (`rutas.ts`) con ruta, carga perezosa y título; derivar router, precarga y sitemap.
- Esfuerzo: M.

#### M3. Tipos laxos
- Dónde: src/paginas.ts (`ComponentType<any>`, `as unknown as`), src/App.tsx (`buscarLegal(...)!`), src/data/proximamente.ts:27 y src/data/equipo.ts:144 (`as` sobre JSON sin validar), tools/vite/resumenes.ts (casts).
- Problema: un JSON mal formado pasa tsc y falla en ejecución o en el prerender.
- Arreglo: validar los JSON con un esquema (zod/valibot o validador propio) en un test y en resumenes.ts; tipar las páginas con un genérico; sustituir `!` por rama de error.
- Esfuerzo: M.

#### M4. Sin ESLint (ni react-hooks) y TS no del todo estricto
- Dónde: package.json, tsconfig.json.
- Problema: nada vigila dependencias de efectos, keys, `any`. Faltan `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`; `types` incluye `node` también para código de cliente.
- Arreglo: ESLint flat config con typescript-eslint y eslint-plugin-react-hooks en `npm run check`; activar `noUncheckedIndexedAccess` y corregir lo que salga; separar tsconfig de cliente y de scripts.
- Esfuerzo: M.

#### M5. Componentes enormes con varias responsabilidades
- Dónde: src/pages/Proyecto.tsx (723), Inicio.tsx (381), Miembro.tsx (379), src/components/AnimacionFlujo.tsx (420), Galeria.tsx (321), src/estilos/global.css (5929 líneas).
- Problema: difíciles de revisar y de probar; global.css sin partición.
- Arreglo: extraer secciones de Proyecto/Miembro a componentes con su CSS; dividir global.css por componente o CSS modules.
- Esfuerzo: L.

#### M6. Galeria: riesgo de `lista[actual]` fuera de rango
- Dónde: src/components/Galeria.tsx.
- Problema: si cambia la lista (cambio de idioma o ficha) con el visor abierto, `actual` puede apuntar fuera; con noUncheckedIndexedAccess saldría el aviso.
- Arreglo: acotar el índice con `Math.min` o cerrar el visor al cambiar la lista; test.
- Esfuerzo: S.

#### M7. tools/vite/resumenes.ts relee todas las fichas en cada `load`
- Dónde: tools/vite/resumenes.ts (`leerFichas`, `CAMPOS_RESUMEN`).
- Problema: dos módulos virtuales relanzan la lectura completa; sin invalidación en dev más allá de la recarga; campos a mano que se desincronizan del tipo `Proyecto`.
- Arreglo: caché por mtime y `addWatchFile`; derivar `CAMPOS_RESUMEN` del tipo o validar con test.
- Esfuerzo: S-M.

#### M8. CI frágil
- Dónde: .github/workflows/check.yml, pages.yml.
- Problema: actions por tag `@v4` y no por SHA; sin dependabot ni `npm audit`; Node 22 fijo a mano; pages con `cancel-in-progress: true` puede cancelar un despliegue en curso.
- Arreglo: fijar SHAs y añadir `.github/dependabot.yml`; leer la versión de Node de `.nvmrc`/`engines`; `cancel-in-progress: false` en Pages.
- Esfuerzo: S.

#### M9. Herramientas de QA y generación con dependencias sin declarar
- Dónde: tools/qa/*.cjs, tools/og/*.mjs, tools/generar-marca.mjs, scripts/diagramas-webp.mjs.
- Problema: usan Playwright (no está en package.json), rutas absolutas `/opt/node-tools/...` y `require` duplicado; no funcionan en otra máquina.
- Arreglo: declarar `playwright` en devDependencies (o documentar el requisito), resolver la ruta por variable de entorno, extraer un módulo común.
- Esfuerzo: S-M.

#### M10. scripts/indexnow.mjs y scripts/sitio.mjs
- Dónde: ambos.
- Problema: `fetch` sin timeout ni reintentos; URL del sitio hardcodeada en vez de una constante compartida con el prerender y vite.config.ts.
- Arreglo: `AbortSignal.timeout`, constante única en un módulo de configuración.
- Esfuerzo: S.

### Leves

- L1. Dependencias desactualizadas: `npm outdated` lista paquetes por detrás; revisar con dependabot y subir en bloque (S).
- L2. `key={i}` por índice en listas de Proyecto/Miembro/Inicio (S): usar un id estable.
- L3. `useMovil` triplicado en varios componentes (S): un hook compartido en src/utils.
- L4. `Desplazamiento` en App.tsx con MutationObserver: justificarlo con comentario o sustituirlo por el hook de ubicación (S).
- L5. src/i18n/Idioma.tsx: nombres de meses a mano; usar `Intl.DateTimeFormat` (S).
- L6. Posibles claves i18n sin uso: 46 de 268 claves es no aparecen literalmente en el código (estado.*, valor*.*, participa.*, prop.fase.*, unir.area.*, linea.*, hito.*, equipo.papel.*). Probablemente sean claves dinámicas (`t(\`estado.${x}\`)`); comprobar y, si no, borrar. Añadir un test que detecte claves huérfanas sin falsos positivos (S).
- L7. ErrorBoundary/Formulario revisados sin fallos graves; Formulario sin estado de error de red visible, si se confirma (S).
- L8. `build` usa `cp` en scripts de npm (no portable a Windows); usar un script Node (S).
- L9. Carga perezosa propia (src/paginas.ts) en lugar de `React.lazy`/`Suspense`: más código propio que mantener; valorar migrar junto con M1 (M).

### Orden recomendado
1. G1 + M2 (una sola tabla de rutas y títulos), con M4 (ESLint) para fijar el resultado.
2. G3 (jsdom y tests de comportamiento) antes de tocar M1 y M5.
3. G2 y M3 (validación de datos y prerender verificable).
4. M8, M9, M10 y leves como tareas sueltas S.

---

## Auditoría de limpieza — Portal-Galivelop (2026-11-15, solo lectura)

Repo limpio en general: 897 archivos versionados, ningún `src/*.ts(x)` huérfano, ningún TODO/FIXME, ni código comentado, ni enlaces rotos en docs (fuera de `docs/records/`).

### Tabla

| # | Ruta | Por qué es basura (evidencia) | Riesgo | Acción |
|---|------|-------------------------------|--------|--------|
| 1 | `public/proyectos/galivelop-workflow/{subagentes,fases,pre-push,sesion}.webp` + sus `-mini.webp` (8 archivos, ~392 K) | Ningún `src/`, JSON, script ni `index.html` los nombra por ruta (`grep -F "galivelop-workflow/subagentes"` vacío); la galería de `galivelop-workflow.json` solo usa portada, presentacion, arquitectura y versiones. Los genera `scripts/diagramas-webp.mjs`; el handoff dice que se rehacen con la 0.6.0 | ALTO (están publicados en `/proyectos/...`; pueden estar indexados o compartidos) | Revisar con la persona: dejar hasta rehacerlos o enlazarlos en la galería. No borrar solo |
| 2 | `src/data/productos.ts` `buscarProducto` | `grep -w buscarProducto src tools scripts` solo da su definición | Bajo | Borrar función |
| 3 | `src/components/IconoRed.tsx` `nombreRed` y tipo `EnlaceRed` (export) | `nombreRed` solo se usa dentro del mismo archivo; `EnlaceRed` sin uso fuera | Bajo | Quitar `export` (o borrar) |
| 4 | `src/components/animaciones/tipos.ts`: `DosModos`, `Geometria`, `Ancla`, `Opciones`, `esDosModos`, `idsDe` | `grep -w` no encuentra uso en otros archivos (sí dentro de `tipos.ts`, posible uso interno) | Bajo | Quitar `export` o borrar los de uso nulo |
| 5 | `src/data/legal.ts` `DatoLegal`, `EnlaceLegal`, `SeccionLegal`; `equipo.ts` `Negocio`; `novedades.ts` `Entrada`; `productos.ts` `EstadoProducto`; `proyectos.ts` `EstadoFicha`; `tonos.ts` `Tonos`; `paginas.ts` `NombrePagina`; `recuerdo.ts` `Posicion`; `Galeria.tsx` `GrupoGaleria`; `Novedades.tsx` `POR_TANDA` | Tipos/constantes exportados sin importador (grep -w) | Bajo | Quitar `export` (son tipos, sin coste en bundle) |
| 6 | Claves i18n `sec.descripcion` (es/gl/en, `src/i18n/textos.ts` L42/370/696) | `grep "sec.descripcion"` solo en `textos.ts`; no es dinámica (`sec.*` se usa por clave literal) | Bajo | Borrar las 3 líneas |
| 7 | Claves `contacto.github` y `contacto.correo` (es/gl/en) | Solo aparecen en `textos.ts`; `Inicio.tsx` usa `contacto.titulo/texto/otros`. Falta confirmar que no se arma `contacto.${x}` (no se encontró) | Bajo | Borrar 6 líneas tras `npm run check` |
| 8 | CSS: `.cabecera-captura`, `.cabecera-color`, `.cabecera-ilustracion`, `.collage-0/1/2`, `.colab-*`, `.estado-*`, `.participar-*`, `.icono-tec-*`, `.publicacion-imagenes-N`, `.mk-al/cel/no` | Aparentes huérfanos del análisis, pero TODOS son clases dinámicas (`cabecera-${modoCabecera}`, `collage-${i}`, `estado-${estado}`, `mk-${m}`…). Falsos positivos; `clases.test.ts` ya vigila esto | — | NO tocar |
| 9 | `public/proyectos/*/og*.jpg`, `public/marca/banda-participar*-mini.webp` | Parecen sin uso por ruta, pero se resuelven por plantilla (`og-${idioma}.jpg` en `paginas-estaticas.mjs`; `${base}-mini.webp` en `Proyecto.tsx:676`) | — | NO tocar (falso positivo) |
| 10 | `public/google8f2f8f0bd97410a4.html` (4 K) | Sin referencias, pero es la verificación de Search Console | Alto | Conservar |
| 11 | `capturas/` (28 K, 2 PNG de 2026-11-11), `tsconfig.tsbuildinfo` (16 K), `dist/` (44 M), `node_modules/` (222 M) | Todos ya en `.gitignore` (`/capturas/`, `*.tsbuildinfo`, `dist`); `git ls-files` no los lista. No hay nada versionado que quitar | Bajo | Solo borrado local opcional (`capturas/` la crea `npm run capturas`) |
| 12 | Nombres viejos en docs: `docs/media/2026-10-27/01-piloto-generador/ficha.md:4` y `docs/media/2026-10-31/01-repos-publicos/ficha.md:4` (`docs/difusion/...`); `docs/diseno/2026-11-04-workflow-presentation.md:252` (`docs/traspaso.md`) | Rutas que ya no existen (renombrado a `docs/media/`). `desarrollo.md:221,227` y `tipos.ts:135,141` mencionan «antes `docs/difusion`» a propósito; `galivelop-workflow.json:1273-1275` cita `recoger.py` (nombre real del script del flujo, probablemente correcto) | Bajo | Corregir los 3 textos de ficha/diseño; dejar los demás |
| 13 | `scripts/isobatas-provisionales.py` | `docs/marca.md:142` dice que `public/marca/isobatas.svg` «sustituye a las provisionales… quitar o dejar de usar el script provisional»; solo lo cita la doc | Medio | Revisar con la persona; si `isobatas.svg` ya es el definitivo, borrar |
| 14 | Dependencias dev `@fontsource-variable/dm-sans`, `inter`, `plus-jakarta-sans`, `@fontsource/cormorant-garamond` | No se importan en `src/`, PERO `tools/og/toveriai-og.html` y `galivelop-image-generator-og.html` las cargan desde `node_modules` para generar las vistas previas | — | NO borrar (en uso por `tools/og`) |
| 15 | `src/fontsource.d.ts`, `src/virtual.d.ts` | Sin importadores, pero son declaraciones de tipos ambientales (necesarias para `tsc`) | — | NO tocar |
| 16 | `docs/media/` (11 M; 9,7 M en `2026-11-14/`), `tools/og/fuentes/` (15 M) | Histórico de piezas y fuentes de las OG; son insumo del flujo, no basura demostrada | Medio | Opcional: revisar con la persona si piezas ya publicadas deben quedarse en git |

### Pesos
- Candidatos reales a borrar en código/i18n: ~0 K en disco (solo líneas: #2-#7).
- Archivos huérfanos probables: ~392 K (#1), riesgo alto.
- Ignorados ya en git y borrables en local: `dist` 44 M, `capturas` 28 K, `tsbuildinfo` 16 K (`node_modules` 222 M).
- Total versionado que sobra con seguridad: prácticamente nada.

### Recuento por riesgo (candidatos reales: filas 1-7, 12, 13, 16)
Alto: 1 · Medio: 2 (#13, #16) · Bajo: 7 (#2-#7, #12). Falsos positivos descartados: #8, #9, #10, #14, #15.

---

## Auditoría de rendimiento y tiempos · 2026-11-15

Solo lectura del repo. Build propio en `scratchpad/dist-perf` (+ prerender en `scratchpad/site/dist`), servido con
`vite preview`. Medido con Playwright/Chromium: móvil 390x844, red 1,6 Mbit/s y 150 ms de latencia, CPU x4. Lighthouse no
está instalado (`npx --no-install lighthouse` falla): no se usó. Los scripts de medida están en el scratchpad
(`medir.cjs`, `cls.cjs`, `attr.cjs`). Las rutas son relativas a `/home/user/Portal-Galivelop`.

### 1. Cifras de la web

**`dist/` (44 MB; 433 webp = 39,3 MB, el 89 %)**: JS 1,1 MB (25 archivos), CSS 85 KB (1), fuentes 327 KB (15 woff2),
JPG 1,8 MB (12, las de vista previa en redes y logos), PNG 266 KB, SVG 86 KB, HTML 393 KB (47). `public/proyectos/tarkor`
son 35 MB en 322 archivos. 53 webp pasan de 200 KB; los mapas de Tarkor (1200x900) rondan 300-345 KB cada uno.

**Chunks iniciales (home)**: `index-*.js` 552 KB (165 KB gzip) + `chunk-OB3PAWPO` 40 KB (react-router) + `jsx-runtime` 9 KB +
`createLucideIcon` 3 KB + `IconoGitHub` 2 KB. En la práctica, 180 KB gzip de JS antes de pintar nada React. Las 10 páginas
van en chunk propio (bien) y las fichas en su chunk de datos. CSS: un solo archivo, 86 KB (19 KB gzip), bloqueante, sin CSS crítico.

**Qué hay dentro de `index-*.js` (atribución por sourcemap)**: react-dom 207 KB, **21 SVG de marca en crudo 213 KB**
(`src/components/IconoMarca.tsx:1-21`, `?raw`; 55 KB gzip), textos i18n 45 KB, react-router (en `chunk-OB3PAWPO`), lucide 7 KB.
**Tree-shaking: bien.** lucide-react aporta 7 KB; simple-icons solo va en el chunk lazy `Retrato` (92 KB, 39 KB gzip) con
los logos usados, no la librería entera.

**Fuentes**: 3 variables (Big Shoulders, Literata, JetBrains Mono) en 16 `@font-face` con `unicode-range` y
`font-display: swap`. En la home solo bajan los subconjuntos latin: 35,8 + 52,8 + 40,7 = **126 KB** (la misma cifra en
todas las rutas). Sin `<link rel=preload>` de ninguna: se descubren tras bajar y parsear el CSS.

**Medida en móvil con red lenta (3 pasadas de la home, estables ±20 ms)**

| Ruta | FCP | LCP (elemento) | CLS | TBT~ | Transferido (JS / CSS / fuentes) |
|---|---|---|---|---|---|
| Inicio `/` | 0,68 s | 2,63 s (`img.hero-fondo`, isobatas.svg 56 KB) | 0,051 | 110 ms | 530 KB (180 / 19 / 126) |
| Inicio `/en/` | 0,67 s | 2,68 s | 0,036 | 144 ms | 530 KB |
| Ficha Tarkor | 0,70 s | **4,15 s** (`img.proyecto-fondo`, portada.webp 148 KB) | **0,122** | 140-180 ms | 650 KB (260 / 19 / 126) |
| Ficha toVeriAI | 0,70 s | 3,12 s | **0,149** | 160 ms | 518 KB |
| Novedades | 0,77 s | 0,77 s (LI del stub) | 0,057 | 111 ms | 392 KB |
| Equipo | 0,68 s | 2,39 s | 0,095 | 93 ms | 606 KB |

Lo bueno: FCP bajo en todas (el HTML prerenderizado pinta texto enseguida); TBT razonable (2-3 tareas largas).

**Hallazgos**

- **CLS 0,05-0,15 por el cambio prerender → React.** `src/main.tsx:93-97` usa `createRoot().render`, no `hydrateRoot`, y
  el prerender (`scripts/paginas-estaticas.mjs:350`) mete en `#root` un `<main><h1><p>…` de solo SEO, con otra estructura
  que la app. Cuando React monta (~1,4-1,6 s), el contenido se sustituye y todo salta (fuentes de los desplazamientos:
  `UL`, `P`, `LI`). Es la causa del CLS en las 6 rutas medidas, y por encima del 0,1 de «bueno» en fichas.
- **LCP lo marca una imagen decorativa que solo existe tras el JS.** `src/pages/Inicio.tsx:74` (`hero-fondo`, isobatas.svg
  56 KB / 18 KB gzip, sin `width/height`, 15 `<path>` con `stroke-opacity`) y `src/pages/Proyecto.tsx:207-220`.
  Al no estar en el HTML ni con preload, el navegador la pide cuando React ya ha pintado.
- **Cadena de carga en serie**: HTML → index.js (162 KB gz) → `precargarRuta` (`src/main.tsx:93`) → chunks de página y
  ficha → render. En la ficha de Tarkor son tres saltos de red después de `index.js` (Proyecto 8 KB, tarkor 33 KB,
  Retrato 39 KB), cada uno con 150 ms de latencia. El prerender no inyecta `modulepreload` de los chunks de esa ruta.
- **Iconos de marca con trazo escalonado**: `src/assets/iconos/*.svg` son vectorizaciones de mapa de bits
  (`M482 154L542 154L542 156L560 156…`, escalones de 2 px), 212 KB para 21 iconos de 3-24 KB cada uno. La home solo usa
  8-9 de ellos (`Inicio.tsx:25-35,259-290`) pero el módulo los trae todos, y como `Inicio` no es lazy, van al bundle inicial.
- **`NoEncontrado` se descarga en la ficha de Tarkor** (chunk de 1,1 KB gzip; se ve en la cascada). Menor.
- **Caché**: GitHub Pages fija `max-age=600`, no se puede cambiar. Los archivos con hash se revalidan cada 10 min. Sin
  control desde el repo; solo mitigable con menos bytes.
- **Imágenes**: todo webp (bien). `<img>` con `width/height` en la mayoría (34 `<img>`; sin dimensiones:
  `Inicio.tsx:74,113`, `Proyecto.tsx:207-220,269`, `Galeria.tsx:218,284,304`, `MenuProyectos.tsx:101`, `ImagenTema.tsx:27`
  si no se le pasan). `srcset` solo en Novedades y la banda de participar: **sigue pendiente** en el resto (portadas de
  ficha, galería, collage). Los 12 JPG/1,8 MB y el PNG de 105 KB (`gv-logo-512.png`, apple-touch-icon) no los sirve la web,
  solo redes y el icono; solo ocupan `dist/`.
- **Collage de la home** (`Inicio.tsx:107-120`): pinta las mini de todos los proyectos en cada una de las 3 piezas (N x 3
  `<img>`); las inactivas son `lazy`, pero se bajaron 6 miniaturas (~170 KB) en el inicio.
- **Diferido bien hecho**: `loading="lazy"` casi general, imágenes de tema oscuro/claro ocultas sin bajarse, páginas lazy.

### 2. Tiempos de desarrollo (máquina de la nube, caché caliente)

| Paso | Tiempo |
|---|---|
| `npx tsc -b` (incremental) / `--force` | 0,85 s / 1,34 s |
| `prettier --check` | 1,9 s |
| `vitest run` (25 archivos, 216 tests) | 2,9 s (la prueba más lenta, 347 ms: `paginas.test.ts`; el resto <60 ms) |
| `bash tools/qa/tests/test-ganchos.sh` | **24,8 s** (26,3 s con la medición) |
| **`npm run check` total** | **~31 s, de los que el 80 % es `test-ganchos`** |
| `vite build` (rolldown) | 1,18 s (1,7 s con `cp` de `public/`, 40 MB) |
| `scripts/paginas-estaticas.mjs` | 0,07 s |
| `npm run build` completo | ~3 s |

`test-ganchos.sh` lanza **~788 procesos `python3`** (213 llamadas a `config.py --root … get`, 75 a un script inline, 45 +
30 al clasificar `content`/`code`, 39 `ast.parse`), cada uno ~50 ms de arranque, más los tests unitarios de `gw-portal`
(3,2 s) y `gw-seo` (0,6 s). Mide ganchos que casi nunca cambian.

### 3. Mejoras (ordenadas por impacto)

| # | Gravedad | Mejora | Dónde | Ganancia estimada | Esfuerzo |
|---|---|---|---|---|---|
| 1 | **grave** | Vectorizar de nuevo los 21 iconos de marca (potrace/svgo con `--multipass` y `floatPrecision`; hoy son escalones de 2 px) y/o cargar solo los que usa cada página. | `src/assets/iconos/*.svg`, `src/components/IconoMarca.tsx:1-21` | -40 a -50 KB gzip del bundle inicial (de 165), ~-25 % del JS inicial; LCP -0,3 s en móvil lento | M |
| 2 | **grave** | Quitar el salto prerender→React: o `hydrateRoot` con el mismo marcado, o hacer que el stub de SEO no se vea (oculto con una clase hasta montar) o tenga la misma altura. | `src/main.tsx:93-97`, `scripts/paginas-estaticas.mjs:350` | CLS de 0,05-0,15 a ~0; fichas de «mejorable» a «bueno» | M-L |
| 3 | **medio** | Que el LCP no dependa del JS: pintar el hero/portada en el HTML prerenderizado (`<img fetchpriority=high>` o `<link rel=preload as=image>`) y poner `width/height` en `.hero-fondo` y `.proyecto-fondo`. | `Inicio.tsx:74`, `Proyecto.tsx:207-220`, `paginas-estaticas.mjs` | LCP ficha 4,1 s → ~2,5 s; home 2,6 → ~1,8 s | M |
| 4 | **medio** | `modulepreload` de los chunks de cada ruta e idioma en el HTML prerenderizado (con `build.manifest`) para romper la cascada index → página → ficha → Retrato. | `vite.config.ts:10`, `paginas-estaticas.mjs`, `src/main.tsx:93` | -1 a -2 saltos de red (~150-300 ms con latencia móvil) en fichas | M |
| 5 | **medio** | `rel=preload` de las dos fuentes de la primera pantalla (Big Shoulders latin 36 KB, Literata latin 53 KB), y revisar si JetBrains Mono (41 KB) hace falta en la home (carga diferida). | `index.html:7-40`, `src/main.tsx:1-3` | Texto con fuente final ~300 ms antes; -40 KB en la home si se difiere | S |
| 6 | **medio** | Reducir `isobatas.svg` (56 KB, 18 KB gzip, usado en home y fichas): simplificar trazos o generarlo con menos puntos. | `public/marca/isobatas.svg` | -10 a -14 KB gzip y imagen LCP más rápida | S |
| 7 | **medio** | Acortar `npm run check`: lanzar `test-ganchos.sh` en paralelo con `vitest`, y en él cachear `config.py get` por llamada (213 procesos) o agrupar las lecturas. Ojo: `.githooks/` y `.claude/gw/scripts/` son copia del flujo; el cambio de fondo va al repo del flujo (se pisa con `/gw-update`). Solo en el portal: paralelizar en `package.json:12`. | `package.json:12`, `tools/qa/tests/test-ganchos.sh` | Check de 31 s a ~25 s (paralelo) o ~12 s (menos procesos) | S (paralelo) / M (cache) |
| 8 | **medio** | `srcset`/`sizes` en portadas, galería y collage (ya lo tienen Novedades y la banda de participar); hay `-mini` de 202 imágenes, solo falta usarlas. | `Galeria.tsx:218-304`, `Proyecto.tsx:207-269`, `Inicio.tsx:113`, `ImagenAmpliable.tsx:19` | -50 a -150 KB por ficha en móvil (**sigue pendiente**, ya constaba) | M |
| 9 | leve | Reducir los mapas de Tarkor (53 webp >200 KB; 1200x900 a ~300 KB): recomprimir con q~70-75 o servir 800 px en móvil. | `public/proyectos/tarkor/arte/` | -30 a -40 % de ~35 MB de `dist/` y del peso de la galería al abrirla | M |
| 10 | leve | Collage de la home: pintar solo las 3 miniaturas activas y cambiarlas por estado, no N x 3 `<img>`. | `Inicio.tsx:107-120` | -100 KB y menos nodos DOM al inicio | S |
| 11 | leve | La ficha descarga el chunk `NoEncontrado` sin necesitarlo; revisar `precargarRuta` por qué lo pide. | `src/paginas.ts:67-80`, `main.tsx:93` | -1 petición | S |
| 12 | leve | Subconjuntos de fuente: importar solo `latin` y `latin-ext` (hoy se emiten 15 woff2, 327 KB en `dist/`; el usuario ya baja solo los latin). | `src/main.tsx:1-3` | `dist/` -160 KB (sin efecto para el usuario) | S |
| 13 | leve | `vitest`: `isolate: false` ahorra ~0,7 s según el propio informe (25 workers x 96 ms). Probar, que puede mezclar estado entre archivos. | `vite.config.ts:14` | -0,7 s del 2,9 s | S |
| 14 | leve | CSS crítico: 86 KB (19 KB gzip) bloqueante y de un solo archivo; separar lo de la portada de lo de fichas/legal solo merece la pena si el CSS crece. | `src/estilos/global.css` (5929 líneas) | -5 a -8 KB gzip en la portada | L |

Estado respecto a la auditoría del 2026-11-14: no se repite lo arreglado. «Imágenes sin `srcset`» **sigue pendiente**
(ver 8). Sin cambios en tiempos de build (1,2 s): no hay nada que optimizar ahí.

---

## Auditoría de accesibilidad (WCAG 2.2 AA) y UX — Portal-Galivelop (2026-11-15)

Método: `dist/` servido con `vite preview` (puerto 4313, ya parado), Playwright + axe-core 4.10.2 (wcag2a/aa, 21aa, 22aa, best-practice) sobre 16 páginas x es/gl/en x 1280/375 px x claro/oscuro; Tab real en inicio, ficha, menú, submenú, visor de galería y formularios; escaneo del DOM en 13 páginas x 2 viewports; movimiento reducido. Solo lectura: no se tocó el repo. Lo ya arreglado en `docs/records/auditoria-2026-11-14.md` no se repite; lo que sigue abierto va marcado «sigue pendiente».

Lo que está bien (verificado): salto al contenido, foco visible 2 px en todo lo tabulable, `lang` correcto por idioma, un `h1` por página y jerarquía sin saltos, `dialog.showModal()` con trampa de foco y retorno de foco al cerrar (Esc devuelve a «Ampliar imagen»), submenú operable con teclado (Enter abre, Esc cierra), carrusel con botón de pausa y pausa inicial con `prefers-reduced-motion` (0 animaciones activas), objetivos táctiles >= 24 px (ES/GL/EN miden 31-35 x 24: pasan por el límite), sin errores serios de axe salvo los de abajo.

### Accesibilidad

| # | Gravedad | WCAG | Ruta | Dónde | Hallazgo | Arreglo | Esfuerzo |
|---|---|---|---|---|---|---|---|
| A1 | medio | 2.4.3 Orden del foco, 1.3.2 | todas, móvil (<= ~900 px) | `src/components/Cabecera.tsx:40-102` | El `<nav id="menu-principal">` va antes que los botones ES/GL/EN/tema/hamburguesa en el DOM. Al abrir el menú con el botón (el último), el siguiente Tab salta al contenido de la página, no a los enlaces del menú; con el menú abierto el teclado no los alcanza en orden. Captura: `a11y/menu-movil-abierto.png`. | Mover el foco al primer enlace del menú al abrirlo, o poner el `<nav>` después del botón en el DOM (el CSS ya lo coloca); cerrar con Esc devolviendo el foco al botón (ya cierra). | M |
| A2 | medio | 4.1.3 Mensajes de estado | `/muro`, `/novedades` | `src/pages/Muro.tsx:46-54`, `src/pages/Novedades.tsx:67-75` | Los filtros (`aria-pressed`) cambian la lista sin anunciar cuántos resultados quedan; un lector de pantalla no sabe que algo cambió. | Región `role="status"` visualmente oculta con «N entradas» tras filtrar. | S |
| A3 | medio | 4.1.3, 2.4.3 | `/proyectos/*` (hoja de Apartados) | `src/components/Apartados.tsx:101-113` | La «hoja» (dialog) cambia de título (`#hoja-titulo`) al navegar entre apartados sin anuncio ni mover el foco al título. | Enfocar el `h2` (tabIndex -1) o `aria-live` del título al cambiar de tema. | S |
| A4 | medio | 3.3.2 Etiquetas, 3.3.1 | `/unirse`, `/proponer`, formularios de ficha | `src/components/Formulario.tsx:95-98` y `Campo` (363-385) | Los campos `required` no llevan marca visible ni «(obligatorio)»; el error es solo el de validación nativa del navegador (sin `aria-describedby` propio ni resumen). El texto de ayuda va dentro del `<label>` (`:159`), lo que alarga el nombre accesible del campo. | Marcar obligatorios en el rótulo, sacar la ayuda del `<label>` con `aria-describedby`, y considerar `noValidate` + errores propios con `role="alert"`. | M |
| A5 | medio | 4.1.3 | tras enviar formulario | `Formulario.tsx:332` | El panel de éxito es `role="status"` y sirve, pero se monta con imagen, h2 y `<pre>`; el foco queda en el botón de envío, que desaparece. | Mover el foco al h2 del panel (tabIndex -1). | S |
| A6 | leve | 1.3.6 / best-practice `landmark-complementary-is-top-level` | `/`, `/proyectos/*`, `/equipo/*` (72 de 96 vistas) | `src/pages/Inicio.tsx:288`, `Miembro.tsx:147,202`, `Proyecto.tsx:671` | `<aside>` anidado dentro de otro landmark (`main`/section). axe: moderado. | Cambiar a `<div>`/`<section aria-label>` o sacarlo de la sección. | S |
| A7 | leve | 1.4.3 (exento: logotipo) | todas | `.cabecera-logo .logo-gali`, `.pie-marca .logo-gali` (`global.css`) | axe marca «Gali» (#1aa6df sobre #fff) a 2.77:1 (3:1 si es texto grande). Es un logotipo, exento en WCAG; solo se anota para silenciar la regla en CI. | Nada obligatorio; si el logo se usa como texto sin imagen, oscurecer a >= 3:1. | S |
| A8 | leve | 2.4.4 | `/` y fichas | `Inicio.tsx:19-22` del tab order | Hay enlaces repetidos con el mismo nombre («Tarkor», «toVeriAI», «Galivelop IG» x2-3) hacia el mismo destino: ruido en la lista de enlaces. | Añadir contexto con `aria-label` o `aria-describedby` en los secundarios. | S |
| A9 | leve | 2.4.7 / 1.4.11 | formularios; `.hoja` | `src/estilos/global.css:2912` (`.campo input:focus{outline:none}` con borde + sombra 1 px) y `:5327` (`.hoja:focus{outline:none}`) | El foco de los campos se sustituye por borde oscuro + sombra de 1 px (pasa 3:1, pero es más débil que el anillo de 2 px del resto). | Usar `:focus-visible` con el mismo anillo global. | S |
| A10 | leve | 1.3.1 / 4.1.2 | fichas con galería | `src/components/Galeria.tsx` (contenedor) y `:265` | El contenedor del carrusel no tiene `role="region"`/`aria-roledescription`; el contador `aria-live` solo es «polite» cuando está parado (correcto). Aceptable; se anota por coherencia. | `role="region" aria-label` del título de la galería. | S |
| A11 | leve | 4.1.2 | todas | `Cabecera.tsx:42,98` | El `<nav>` y el botón hamburguesa comparten el nombre «Menú» (`nav.menu`). | Rótulo distinto para el botón («Abrir menú»/«Cerrar menú») según `aria-expanded`. | S |
| A12 | medio | 1.4.11 / 1.4.1 | todas — sigue pendiente (auditoría 11-14, línea 65) | tema (`src/components/Tema.tsx`), `global.css` | No hay CSS para `forced-colors` ni `prefers-contrast`; el tema no sigue `prefers-color-scheme` (decisión de marca: claro por defecto). | Añadir `@media (forced-colors: active)` mínimo (bordes de botones/tarjetas) y `prefers-contrast: more`. | M |
| A13 | leve | 4.1.3 | cambio de ruta | `src/App.tsx:87` | El fallback de `Suspense` es `<div aria-busy="true">` vacío: sin texto ni estado; con conexión lenta, página en blanco. | Texto oculto «Cargando…» con `role="status"` (traducido). | S |

### UX

| # | Gravedad | Ruta | Dónde | Hallazgo | Arreglo | Esfuerzo |
|---|---|---|---|---|---|---|
| U1 | medio | `/` primera visita | `src/i18n/Idioma.tsx:26-37` | El idioma inicial ignora `navigator.language`: un visitante gallego o inglés ve castellano hasta tocar GL/EN (la URL y `localStorage` mandan). | Sin ruta ni guardado, usar `navigator.languages`; mantener es como último recurso. | S |
| U2 | leve | `/` | hero | Dos CTA primarios («Conocer el taller», «Ver las novedades») y «Ver el equipo» más abajo compiten; «Conocer el taller» baja a `#proyectos`, no a una página de «taller», lo que puede confundir con «Cómo trabajamos». | Aclarar el destino (rótulo «Ver los proyectos») o enlazar a la página del taller. | S |
| U3 | leve | formularios | `Formulario.tsx` | Tras enviar, el resultado es un `<pre>` con el correo para copiar (no hay envío real): correcto, pero conviene decirlo ANTES de enviar para evitar la expectativa de que se manda solo. Captura: `a11y/form-vacio.png`. | Nota breve bajo el botón: «Se prepara el correo; tú lo envías». | S |
| U4 | leve | `/muro`, `/novedades` | filtros | Sin estado vacío explícito si un filtro no da resultados (no ocurre hoy con los datos, pero sí al añadir proyectos sin entradas). | Mensaje «Sin entradas para este proyecto» traducido. | S |
| U5 | leve | todas | `Cabecera.tsx` | En móvil la cabecera lleva 5 controles (logo, ES/GL/EN, tema, menú) en 375 px: ES/GL/EN pasan por 24 px exactos, sin margen para zoom de texto. | Separación mínima de 24 px o botones de 32 px de alto. | S |
| U6 | leve | `/proyectos/*` | ficha larga | Ficha con 25 encabezados y «En esta página» (nav): bien, pero el orden de Tab recorre muchas tarjetas con la misma etiqueta antes de llegar al pie. | Enlace «volver arriba» tras «A fondo» o `Home/End` no es necesario; solo valorar. | S |

### Pendiente de verificar a mano (no automatizable)
- Lector de pantalla real (NVDA/VoiceOver) sobre A1-A3: se ha comprobado el DOM y el orden de Tab, no la locución.
- Contraste del texto atenuado en tema oscuro: axe no marcó nada en oscuro (96 vistas), pero no mide imágenes de fondo.

### Capturas
`a11y/menu-movil-abierto.png`, `menu-movil.png`, `form-vacio.png`.
