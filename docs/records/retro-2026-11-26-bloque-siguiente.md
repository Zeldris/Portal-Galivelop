# Retro 2026-11-26: bloque «Siguiente» camino de `main`

Lo revisado: `origin/main..ccr-1c3b5b63-tdttd6` (17320a6..7448c96): feed Atom de Novedades, imagen OG de cada
producto, diario del taller (Q-32, trozos 1-3) y auditoría de rendimiento sobre la página estática; la bitácora.
Revisiones de bloque: 6e28d10 (`Findings: 9`) y f5b5cba (`Findings: 3`). Sin desviaciones apuntadas (`task.py
deviations` vacío).

**Estado:** pendiente de la decisión de la persona.

## Medida (`gw-opt-tokens`, desde 17320a6)

151 llamadas, contexto medio 123k (suelo 102k, techo 134k), 1 compactación con presupuesto 1; todo en el modelo
grande de la sesión principal. Arranque fijo ~88k por llamada: 72 % de la entrada (ya conocido, T3 del 2026-11-25:
los conectores no se pueden quitar desde aquí). `pending.md` se leyó 11 veces (584k arrastrados; 22 el 2026-11-25),
`scripts/paginas-estaticas.mjs` 25 (449k), la bitácora 12 (357k).

## Propuestas

### P1. Comprobación de «la persona» en el texto público (proyecto; comprobación)

La revisión 6e28d10 tuvo que quitar «la persona» del texto del diario: es vocabulario interno del flujo y no de la
marca. Es mecánico, así que va a un test, no a una regla: `src/i18n/textos.test.ts` (o un test nuevo en
`src/data/`) falla si `textos.ts`, `src/data/**/*.json` o `src/data/diario/` contienen «la persona» / «a persoa» /
«the person». Coste: un test pequeño. Riesgo: falsos positivos en un texto legítimo; se ve al instante y se
resuelve con una lista de excepciones.

### P2. Barrido R-8 de `tools/qa/` (proyecto; barrido de leves)

El script con más leves abiertos es `tools/qa/` (lo tocó este bloque). Tarea R-8, para la próxima versión, que
cierra:
- `auditar-accesibilidad.cjs`, `capturas.cjs` y `medir-paginas.cjs` usan `normalizarRuta` y `motivoNoEstatica`
  (hoy miden la portada si la ruta va sin barra);
- `pagina-estatica.cjs`: `404.html` como ruta que no es de página; canonical con atributos en cualquier orden y base
  sacada de `BASE`; `new URL(ruta, BASE)` cuando `BASE` va sin barra;
- `auditar-rendimiento.cjs` lee las `@font-face` solo del primer CSS; `auditar-seguridad.cjs` pasa `src/` dos veces;
- `probar-lector.cjs` da verde sin probar nada con una ruta sin guion.
Riesgo: ninguno en la web (solo herramientas de QA); cada arreglo con su test.

### P3. Entradas largas de `pending.md` (proyecto; comprobación)

La regla T1 del 2026-11-25 (sub-viñetas cortas) se sigue rompiendo: la entrada «Guiones de lectura» es una línea de
~1,5k caracteres y varias de «Leves» pasan de 800. La relectura bajó a la mitad, pero un `grep -A` trae esas líneas
enteras. Como regla que se rompe, pasa a comprobación: un test de `tools/qa/tests/` (o en vitest) que falla si una
línea de `docs/records/pending.md` pasa de 400 caracteres, y partir las que hay. Coste: el test y una pasada de
contenido. Riesgo: ninguno.

## For Galivelop-workflow

- `review-scope.py --trivial` sin copia del flujo a mano solo avisa y sale con 0; la sesión no sabe si el diff es
  trivial. Propuesta: que diga «trivial» o «no trivial» con lo que tiene (marcando lo que no pudo saber) y no 0
  ambiguo.
- El aviso de `change-size` cuenta desde `origin/main` aunque el bloque ya cerrara con `Findings:`; tras
  `reviewed.sh` sigue pidiendo una revisión que ya está hecha. Propuesta: contar desde el último `Findings:`.
