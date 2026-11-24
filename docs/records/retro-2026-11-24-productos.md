# Retro 2026-11-24 · Productos (GVE, Developer ampliada, visibilidad)

Rama `ccr-b2d381ed-e10ez8`, de b4afcc3 a c19efdf: workflow 0.9.0 e image-generator, diagramas de Fable, página de
Galivelop Evaluator, Developer ampliada, índice `/productos`, cabecera y banda del inicio. Incluye la pasada de
`gw-opt-tokens`.

**Estado:** aprobada por la persona (2026-11-24): P1-P5 aplicadas; P6 aplazada y apuntada como tarea en
`docs/records/pending.md`. Dudas de los diagramas: «Sin factura por uso», «nube: opcional, por papel» y las casillas
✓/✗ de GVE se quedan.

## Medida (`measure.py --hours 0`)

- Sesión principal: 73 llamadas, 132k de contexto medio, 2 compactaciones; 9,7M de entrada (72 % arranque fijo).
- Subagentes: 13, 144 llamadas, 10,9M de entrada. El de los diagramas (`general-purpose`, Fable) arrancó con 79k;
  un `gw-worker` arranca con 24k.
- Lo más arrastrado en la principal: la primera lectura de la bitácora (104k), tres capturas del prototipo leídas
  como imagen (51k cada una) y los dos diagramas (30k cada uno).

## Propuestas (de más a menos peso)

- **P1 · Diagramas con `gw-worker` y modelo Fable** (proyecto, tokens). Una fila en `selector.cases` de
  `.claude/gw.json`: «diagrama o figura de una página → `gw-worker`, modelo `fable`». Ahorro: ~55k × 16 llamadas ≈
  0,9M de entrada por encargo. Riesgo: ninguno de calidad (mismo modelo; solo cambia el arranque).
- **P2 · El generador de los diagramas, al repo** (proyecto, navegación). `gen.py`, que dibuja `gd-harness.svg` y
  `gve-evaluacion.svg`, solo está en el scratchpad y se perderá: retocar un texto del diagrama obligaría a rehacerlo.
  Va a `scripts/diagramas/` con una línea en `docs/desarrollo.md`. Riesgo: ninguno.
- **P3 · Test: la cabecera estática tiene los enlaces de la de React** (proyecto, check). La revisión encontró que
  `cabecera()` de `scripts/paginas-estaticas.mjs` no llevaba Productos aunque `Cabecera.tsx` sí. Un test en
  `src/estatico.test.ts` que saque los `to="…"` de `Cabecera.tsx` y compruebe cada ruta en la cabecera estática.
  Riesgo: falsos rojos con un enlace solo de React (se listan aparte).
- **P4 · Sin guardas temporales en los tests** (flujo, revisión). Un subagente dejó `if (existsSync(...))` en un
  test «hasta que existan las figuras», creyendo que no existían: la comprobación quedaba apagada sin aviso. Regla
  de `REVIEW.md`: un test no se condiciona a que exista lo que comprueba; si falta, va como `it.todo` o pendiente.
- **P5 · Capturas del prototipo en una hoja de contacto** (proyecto, tokens). La principal leyó tres capturas
  (153k arrastrados); la hoja de contacto (ya en las notas de `gw-opt-tokens`) da una sola imagen. Se añade al
  encargo del `prototype` en las notas del portal. Riesgo: menos detalle; se abre la grande solo si hace falta.
- **P6 · Activar las herramientas de front del flujo 0.9.0** (proyecto, check). `.claude/gw.json` no tiene sección
  `front`, así que Stylelint, tokens DTCG y capturas de referencia no corren en el check ni en el CI. Tarea propia,
  después de publicar productos.

Barrido de leves: en `docs/records/pending.md` ningún script tiene dos o más leves abiertos; no se propone.

## For Galivelop-workflow

- P4 (regla de `REVIEW.md` contra guardas temporales en tests) sirve a cualquier proyecto.
