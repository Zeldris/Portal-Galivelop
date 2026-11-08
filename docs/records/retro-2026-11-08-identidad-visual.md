# Retro: identidad visual propia (`docs/marca.md` aplicada a la web) (2026-11-08)

**Estado:** pendiente de la persona.

Lo revisado: los commits de `ccr-47a38edd-v566du` que van a `main` (desde `9e1a21e`: investigación y hoja de estilos
de la marca, tipografía B, tema claro, tokens, portada con isobatas, barrido de `global.css`, arreglos de la revisión
y vistas previas de Galivelop IG) y la sesión medida con `gw-opt-tokens` (`measure.py --since 9e1a21e`).

## Medida (`gw-opt-tokens`)

- 120 llamadas en la sesión principal, contexto medio de **132k** (suelo 98k, techo 154k), 3 compactaciones: por
  debajo del umbral de 150k del reparto, pero el suelo es alto (la bitácora y las instrucciones fijas) y cada tramo
  dura 30 llamadas. Dos subagentes (una investigación en Sonnet, 8 llamadas; una revisión en el grande, 18).
- Lo más pesado: la respuesta del `quickstart` de `Artifact` para el prototipo (10,6k, **308k arrastrados**: el
  resultado más caro de la sesión); `global.css` leído **44 veces** (410k) durante el barrido, hecho en la sesión
  principal con el modelo grande; **17 capturas** de página entera para revisar el aspecto (unos 34k arrastrados cada
  una, ~570k en total).
- Calidad: la revisión de la fase 1 dio 8 hallazgos (6 arreglados, 3 leves apuntados); ninguno por el modelo, dos por
  restos del barrido (un `h4` duplicado, utilidades sin uso) que una comprobación mecánica habría visto.

## Propuestas

Por ahorro estimado y coste de hacerlas, de más a menos.

| # | Qué | Dónde | Destino |
|---|---|---|---|
| T1 | **El prototipo se publica desde un subagente.** El `quickstart` de `Artifact` mete 10,6k en el contexto y se arrastra hasta la compactación (308k). Un subagente ligero (fork o encargo con el HTML y el enlace de vuelta) publica y devuelve solo la URL. Riesgo: ninguno (el prototipo ya está escrito cuando se publica). Nota en «Notas del portal para las skills» de `AGENTS.md` (`prototype`) y en `.claude/gw/gw-opt-tokens.md`. | `AGENTS.md`, `.claude/gw/gw-opt-tokens.md` | Portal; la regla general, para el flujo (abajo) |
| T2 | **Barrido de estilos con plan cerrado, al modelo barato.** `docs/marca.md` ya decía qué cambiar; el barrido de `global.css` (44 lecturas, 113 llamadas de Bash, modelo grande) encaja en la fila «Página o sección nueva con el plan cerrado» de `gw-selector`: un subagente ligero por bloque de la hoja (cabecera, fichas, galería…) que devuelve el diff; la sesión revisa el diff y las capturas. Añadir a esa fila de `selector.cases` «o aplicar una hoja de estilos/decisión de diseño ya escrita». Riesgo: un subagente que no vea el conjunto rompe una regla de otra sección; contrapeso: R1 (la comprobación mecánica) y la revisión del diff. | `.claude/gw.json` (`selector.cases`), `.claude/gw/gw-opt-tokens.md` | Portal |
| T3 | **Hoja de contacto de páginas.** `npm run capturas -- --hoja <ruta> <ruta>…`: una sola imagen con N páginas en miniatura (escritorio y móvil, claro y oscuro), para el barrido visual; la captura entera solo de la página que destaque. 17 capturas a 34k cada una habrían sido 2 o 3 hojas. Riesgo: la miniatura esconde detalles finos (un texto montado); contrapeso: `npm run medir` ya da cortes y desbordes en texto, y la captura entera de la página sospechosa. | `tools/qa/capturas.cjs`, `.claude/gw/gw-opt-tokens.md` | Portal |
| R1 | **Las reglas mecánicas de la marca, en un test.** `docs/marca.md` prohíbe degradados, desenfoques, resplandores y esquinas redondas; la revisión encontró 90 `border-radius` muertos, un `h4` duplicado y utilidades sin uso, y el barrido los dejó porque nada los señala. `src/estilos/marca.test.ts`: falla si `global.css` tiene `backdrop-filter`, `blur(`, `-gradient(`, un `box-shadow` con desenfoque (tercer valor distinto de 0) o un `border-radius` que no sea 0, salvo la línea anterior marcada `/* marca: permitido, <motivo> */` (la retícula del papel, los fundidos de `.nav-ficha`, la sombra de los paneles flotantes). Riesgo: ninguno; un caso nuevo se marca con su motivo y queda documentado en el propio CSS. Tras el test, quitar `--radio`/`--radio-sm` y las ~90 declaraciones muertas (leve de la bitácora). | `src/estilos/marca.test.ts`, `global.css` | Portal |
| R2 | **`REVIEW.md`, «Estilos y textos»:** un cambio visible sigue las 10 reglas de `docs/marca.md`; lo mecánico lo mira R1 (check) y lo de criterio queda como regla: datos (fechas, versiones, etiquetas) en `--datos`, celeste solo en bloques planos grandes, chaflán en tarjetas y botones, foco como línea de tinta. (criterio) | `REVIEW.md` | Portal |
| R3 | **`theme-color` atado a los tokens.** La revisión encontró la barra del navegador de un color que no era de ninguna superficie. Un test (`src/components/Tema.test.ts`) que lee `--superficie` de los dos temas en `global.css` y comprueba que `index.html` (claro) y `COLOR_BARRA` de `Tema.tsx` llevan esos mismos valores. Riesgo: ninguno. | `src/components/Tema.test.ts` | Portal |
| R4 | **Dónde van las imágenes del generador.** En la lista de recursos de `docs/marca.md`, junto a cada uno, la ruta de destino y la orden: el `og` del portal a `public/marca/galivelop-portal.jpg`; la vista previa de un proyecto a `public/proyectos/<slug>/og-fuente.png` + `python3 tools/og/generar.py`; el logo a `public/marca/gv-logo.svg`. Hoy la persona manda la imagen y la sesión averigua el destino. | `docs/marca.md` | Portal |

## For Galivelop-workflow

- `prototype` (skill del flujo): cuando el prototipo se publica con `Artifact`, hacerlo desde un subagente que devuelva
  la URL; la respuesta del `quickstart` (~10k) no tiene por qué vivir en la sesión principal. Medido en el portal el
  2026-11-08: 308k arrastrados en una sesión de 120 llamadas.
- `measure.py`: en «HEAVIEST RESULTS» la fila de `Artifact` enseña los argumentos pero no el `action`; con varias
  publicaciones no se distingue el `quickstart` de un `publish`. Menor.
