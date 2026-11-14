# Retro: auditoría completa y correcciones del 2026-11-14

Commits revisados: f134b44, a28a6a1, 8235148, 8a093e4 y 36b4861 (rama `ccr-5c066d81-ndsd13`), el informe
[`auditoria-2026-11-14.md`](auditoria-2026-11-14.md) y la bitácora.

**Estado:** pendiente de la decisión de la persona.

## Medida (`gw-opt-tokens`, sesión entera)

- **Sesión principal:** 310 llamadas y 4 compactaciones. Contexto medio de 127k (entre 109k y 162k). 39,4M de
  entrada, el 98 % en caché.
- **Lo más arrastrado:**
  - Bash: 219 llamadas, 7,7M.
  - 27 imágenes, 1,7M; varias se leyeron dos o tres veces.
  - `docs/handoff.md`: 32 lecturas, 1,49M.
  - `docs/marca.md`: 6 lecturas, 533k.
  - `global.css`: 16 lecturas, 442k.
- **Subagentes:** 11, con 35,6M de entrada y 54,7k de arranque medio. Los de auditoría (sonnet) hicieron entre 36 y
  60 llamadas cada uno, con unos 120k de contexto medio.
- **En total:** 75M de entrada, la mitad en subagentes.

## Propuestas

Están ordenadas por ahorro estimado. Cada una dice adónde va.

### P1. Recorrido del navegador como herramienta del repo (proyecto)

**Qué pasó.** La prueba a mano y la auditoría de responsive escribieron sus propios scripts de Playwright desde cero:
`recorrido.cjs` (240 líneas), `segundo.cjs`, `galeria.cjs` y `foco.cjs`, que quedaron en el scratchpad. Además, varias
comprobaciones se hicieron con capturas: scroll horizontal, contraste del foco y si el menú se sale.

**Propuesta.** Pasarlo a `tools/qa/recorrido.cjs`, que devuelva **texto**:

- por ancho (320–1920 px) y por tema: errores de consola, scroll horizontal, elementos fuera de la pantalla y
  objetivos táctiles de menos de 24 px;
- el contraste del contorno de foco;
- los enlaces internos que no dan 200.

Las capturas se piden solo para juzgar lo visual.

**Ahorro.** Unas 20–30 llamadas por auditoría y buena parte de los 1,7M arrastrados por imágenes.

**Riesgo.** Que se dé por bueno lo que el script no mira. Contrapeso: el encargo de una auditoría sigue pidiendo
mirar a mano lo visual.

### P2. `/clear` entre la auditoría y las correcciones (proyecto, nota en `gw-opt-tokens.md`)

**Qué pasó.** Las siete auditorías, las correcciones de tres bloques y la revisión fueron en una sola sesión: 4
compactaciones y 310 llamadas a 127k. El informe consolidado ya bastaba para retomar.

**Propuesta.** En una auditoría, cuando el informe está escrito y subido, se pide `/clear` antes de corregir, y otro
tras cada bloque. Es la regla «al cerrar cada tarea» aplicada a las tareas que van seguidas.

**Ahorro.** Con un contexto medio de ~70k en vez de 127k, cerca de la mitad de los 39M de la sesión principal.

**Riesgo.** Perder el porqué de un hallazgo. Contrapeso: el informe lo dice por hallazgo, con su cifra.

### P3. Leer la bitácora por partes (flujo)

**Qué pasó.** La regla ya existe en `.claude/gw/gw-opt-tokens.md`, pero la bitácora se leyó entera 32 veces (1,49M).
La regla escrita no basta.

**Propuesta.** Un gancho `PreToolUse` sobre `Read` de la bitácora sin `offset`/`limit`, pasada la primera lectura de
la sesión, que avise y dé la orden `recover.py --state` o el `sed` de la sección. Es un gancho, así que va al flujo.

**Ahorro.** ~1M por sesión larga.

**Riesgo.** Ninguno: avisa, no bloquea.

### P4. Un encargo de auditoría con tope y formato (proyecto)

**Qué pasó.** Los subagentes de auditoría arrancaron con 55k y llegaron a 60 llamadas. Releían `marca.md` y
`global.css` enteros.

**Propuesta.** Una plantilla de encargo en `docs/runbooks/auditoria.md` con:

- qué leer por secciones (`marca.md` solo el «Mensaje»; `global.css` con `grep` del selector);
- un tope de ~30 llamadas;
- la salida en una tabla (gravedad, archivo:línea, cifra, arreglo propuesto);
- el uso de `tools/qa/recorrido.cjs` (P1).

**Ahorro.** ~1–2M por subagente; con siete, 10M o más.

**Riesgo.** Una auditoría más corta ve menos. Contrapeso: el tope es orientativo y la tabla pide una cifra por
hallazgo. Si algo pide más, se dice y se lanza otro encargo.

### P5. Selectores de atributo comprobados entre JSX y CSS (flujo, en «For Galivelop-workflow»)

**Qué pasó.** La revisión encontró que `Proyecto.tsx` pasó a `aria-current="location"` mientras `global.css` seguía
pintando `[aria-current='true']`. Ahora lo cubre un test que lee el texto del fuente, que es frágil y ya está en
«Pendiente».

**Propuesta.** Hacerlo general: que `clases.test.ts` compruebe también que cada `[atributo='valor']` del CSS lo usa
algún componente, igual que hace con las clases.

**Ahorro.** No ahorra tokens; quita una clase de fallo que solo veía la revisión.

**Riesgo.** Falsos positivos con atributos que pone el navegador (`[open]`) o una biblioteca. Contrapeso: una lista
de excepciones en el propio test.

## For Galivelop-workflow

- **P3.** Gancho que avisa al leer entera la bitácora fuera del arranque.
- **P5.** El test de clases sin uso del portal, ampliado a los selectores de atributo.
- **Nota de Chromium.** Un `import()` dinámico que falló queda en la caché del navegador hasta recargar. Reintentarlo
  sin recargar no sirve, así que el aviso de error ofrece «Recargar». Vale para cualquier proyecto con páginas
  perezosas.
