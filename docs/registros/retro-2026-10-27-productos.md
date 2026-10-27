# Retro 2026-10-27 · Productos en la web (ADR 0002, fase 2) y rediseño del inicio

**Estado:** presentada a la persona el 2026-10-27; lo decidido se apunta en el párrafo siguiente.

Decisiones: (por rellenar cuando la persona responda).

Sesión medida desde 906f9f8 (propuesta de la ADR 0002) hasta 0703f53 (fase 1): 81 llamadas, 125k de contexto medio
(suelo 107k, techo 138k), 6 compactaciones, 13 capturas (189k arrastrados), un subagente en el modelo grande (1,6M de
entrada, 76k de arranque). `/code-review --max-findings all`: 10 hallazgos, todos arreglados en 0703f53.

## Propuestas de `opt-tokens` (por ahorro estimado)

- **T1 · Suelo de 107k por los repos hermanos en `/home/user`.** Ya es un coste conocido (26-10): cuatro `AGENTS.md`
  más cuatro listas de skills entran en cada llamada (~15k) y el arranque de cada subagente sube de ~35k a ~75k. Un
  `/clear` no lo quita: hace falta sesión nueva sin `add_repo` en la principal (otro repo se lee con un subagente que
  lo clona en el scratchpad). Cambio: una línea al principio de «Pendiente» de la bitácora para la próxima sesión.
  Coste: nada. Riesgo: ninguno. Ahorro: ~15k × llamada (~1,2M arrastrados en este bloque) y ~40k por subagente.
- **T2 · Una página nueva con plan cerrado, a un subagente del modelo barato.** `/productos` (datos, página, claves
  en tres idiomas, página estática, test) se escribió en la sesión principal con el modelo grande: ~35 llamadas a
  125k. Con la ADR aceptada y los textos decididos, el encargo cabe en un párrafo (rutas de `TarjetaProxima`,
  `textos.ts`, `FIJAS`, el test y `npm run check`); la sesión principal revisa el diff, `npm run medir` y las
  capturas por sección. Cambio: una fila en `selector.cases` de `.claude/gw.json` («página o sección nueva con
  plan cerrado → modelo barato con `orchestrate-dealer`») y una línea en `opt-tokens.md`. Coste: 5 minutos.
  Riesgo: aspecto peor a la primera; contrapeso: la revisión visual que ya se hace (la persona pidió un rediseño
  igualmente). Ahorro: ~2M de entrada por página.
- **T3 · Capturas que se vuelven a leer.** `productos-escritorio.png` se leyó 3 veces y las 13 capturas arrastraron
  189k. La regla ya existe (27-10) y se incumplió. Cambio: el script de capturas pasa a `tools/qa/capturas.cjs`
  (`npm run capturas -- <página> [sección]`) y, además de la imagen, imprime alto y cortes con lo de
  `medir-paginas.cjs`; la captura se abre una vez por ronda y se manda con `SendUserFile` sin releerla. Coste: media
  hora. Riesgo: ninguno. Ahorro: ~100k arrastrados por ronda.
- **T4 · Sección «Añadir una página» en `docs/desarrollo.md`.** Escribir `/productos` costó un `cat` de cinco
  componentes (8k) y tres lecturas de `desarrollo.md`/`traspaso.md` (6k), y aun así se olvidaron `PAGINAS` de
  `npm run medir` y las metas (dos hallazgos). Cambio: una lista de los sitios que toca una ruta nueva (`App.tsx`,
  `Cabecera.tsx`, `FIJAS` de `paginas-estaticas.mjs`, `PAGINAS` de `medir-paginas.cjs`, claves i18n, test, metas de
  `index.html` si cambia la portada). Coste: 10 líneas. Riesgo: ninguno. Ahorro: ~15k por página y dos hallazgos
  menos. Va con R2.

## Propuestas de `retro` (por gravedad)

- **R1 · Comprobación de formato en `npm run check`** (comprobación automática, de proyecto). Un hallazgo fue
  formato (comillas dobles en tres archivos). Es mecánico: `prettier --check "src/**/*.{ts,tsx}"` con
  `.prettierrc` (`singleQuote: true`, `printWidth: 100`), que reproduce sin cambios los archivos actuales (hay que
  confirmarlo sobre todo `src/` antes de activarlo). Coste: una dependencia de desarrollo y una línea en `check`.
  Riesgo: ninguno; si algún archivo no casa, se formatea en el mismo commit.
- **R2 · Test de rutas: cada ruta fija de `App.tsx` está en `FIJAS` y en `PAGINAS`** (comprobación automática, de
  proyecto). Dos hallazgos (`PAGINAS` sin `productos`; metas de la portada) venían de sitios que una ruta nueva toca
  y nadie listó. Un test en vitest que lea las rutas de `App.tsx` y compruebe `FIJAS` de `paginas-estaticas.mjs`
  y `PAGINAS` de `medir-paginas.cjs`. Coste: 30 líneas. Riesgo: ninguno. Con T4 como lista para las personas.
- **R3 · Test de claves i18n duplicadas** (comprobación automática, de proyecto). Tres claves nuevas repetían
  textos ya existentes en los tres idiomas. Un test que falle cuando dos claves tienen el mismo texto en `es`, `gl` y
  `en` a la vez (textos de más de 12 caracteres, para no pillar «Contacto»). Coste: 15 líneas; hay que mirar si el
  catálogo actual ya tiene dobles legítimos. Riesgo: falsos positivos en textos cortos; contrapeso, el umbral.
- **R4 · Regla en `REVIEW.md`: un componente que usan dos páginas vive en `src/components/`** (criterio, de
  proyecto). `TarjetaProducto` nació en `pages/Productos.tsx` y la portada la importó de ahí. Es un juicio (cuándo
  deja de ser local), así que va al revisor, no a un check. Coste: una línea.
- **R5 · Sin cambios en las skills.** `selector`, `code-review` (10 hallazgos, todos reales), `opt-tokens` (el aviso
  de ventanas mezcladas llevó a medir con `--since`) y esta retro funcionaron. El resumen de compactación perdió qué
  claves se habían quitado y `tsc` lo pilló: lo que la bitácora no guarde se busca con `recuperar.py --buscar`.

## For Galivelop-workflow

- Nada general esta vez: todas las propuestas son de proyecto.
