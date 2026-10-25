# Retro 2026-10-25 — rediseño del front (vistazo, barra de grupos, hojas)

Revisado: commits `e7b5238`, `9a6455e`, `c8ccca2` y la bitácora. Medida de gasto con `opt-tokens/scripts/medir.py
--hours 0`: 394 llamadas, contexto medio 112k (suelo 94k, techo 141k), 10 compactaciones; subagentes 68 llamadas,
5,4M de entrada (4,3M en el modelo grande).

Propuestas presentadas a la persona; su decisión va en la línea de estado al final.

## Gasto (opt-tokens), de más a menos ahorro

- **T1. Subagentes mecánicos con el modelo barato.** 6 de 8 subagentes corrieron con el modelo grande (4,3M de
  entrada) para trabajo con plan cerrado (aplicar estilos, capturas). Aplicar la fila de `selector`: plan cerrado →
  modelo barato; la sesión principal revisa el diff. Riesgo: más fallos visuales; contrapeso: captura por sección y
  revisión en la principal. Dónde: nota en `.claude/gw/opt-tokens.md`.
- **T2. Medir la página en texto, no en imágenes.** 39 capturas leídas (cada una cuesta como cientos de líneas), muchas
  solo para saber cuántas «pantallas» ocupaba una página. Un script `tools/qa/medir-paginas.mjs` (Playwright) que
  devuelve alto en px y pantallas por página y ancho (1280 y 390) y si hay desbordamiento horizontal. Las capturas
  quedan para juzgar el aspecto. Riesgo: ninguno.
- **T3. Leer la bitácora por partes.** `docs/traspaso.md` se leyó 66 veces (415k arrastrados): con
  `recuperar.py --estado` o `sed -n '/^## Siguiente/,/^## /p'` en vez de entera. Riesgo: ninguno.
- **T4. `global.css` por selector.** Leído 32 veces (210k arrastrados): `grep -n '<selector>'` y `sed -n` del rango.
  Riesgo: ninguno. Se apunta en «Costes conocidos».

## Entorno (retro), de más a menos grave

- **R1. Clases globales que chocan (proyecto).** `.tarjeta-imagen` tenía reglas globales del botón ampliable de los
  apartados que deformaban la imagen de la tarjeta de proyecto; lo cazó la revisión, no el check. Regla en
  `REVIEW.md`: una clase de `global.css` usada por dos componentes va acotada por su contenedor. Es criterio, no
  mecánico.
- **R2. Test del ancla malformada (proyecto).** Un `#%` en la URL tumbaba la página (en `App.tsx` desde antes del
  rediseño y en `Apartados.tsx`). Extraer la lectura del ancla a una función `leerAncla()` con su test en vitest
  (que falle sin el try/catch).
- **R3. Singular/plural en textos (proyecto).** «1 elementos» y «1 de 1 hitos» se escaparon. Un helper `plural()` en
  `src/i18n/` en vez de ternarios sueltos; el «1 de 1 hitos» pendiente se arregla con él.

## For Galivelop-workflow

- **G1.** `medir.py` avisa de «sesión abierta fuera del repo» en cada sesión de la nube, donde es lo normal
  (arranca en `/home/user`): que el aviso diga que en la nube es esperado si la variable de compactación está puesta.
