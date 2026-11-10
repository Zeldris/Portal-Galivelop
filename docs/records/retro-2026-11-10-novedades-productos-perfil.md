# Retro · Novedades, productos al perfil y auditoría de front (2026-11-10)

**Estado:** pendiente de la persona.

Lo revisado: los commits de `ccr-47a38edd-v566du` desde `08c7fe5` (9693720, d5277fa, 33c4c75, 6310d51, 96aa78a) y
la bitácora. La revisión de código (`/code-review --max-findings all`, nivel alto) dio 18 hallazgos: 5 medios
arreglados en 96aa78a y los leves en «Pendiente».

## Qué salió bien

- Las tres preguntas a la persona al principio (página de novedades, `/productos` de paso, todos los productos del
  miembro) cerraron el alcance de una vez: no hubo trabajo rehecho por un malentendido.
- La auditoría de front con un subagente en el modelo barato (Sonnet, 2,8M de entrada) y la verificación de sus
  hallazgos en la sesión principal: un falso positivo de contraste (`color-mix`) se descartó con una medida en canvas.

## Qué falló y propuestas

### R1 · La página estática repite la lógica de los datos (proyecto)

Tres de los cinco hallazgos medios son la misma clase de fallo: `scripts/paginas-estaticas.mjs` reimplementa a mano
lo que hace `src/` (orden de `/novedades`, enlaces de las publicaciones, productos del miembro) y se desvía sin que
nada lo note. Ya pasó antes con el muro y los resúmenes.

**Propuesta:** un test en vitest que compare, para `/novedades` y el perfil de cada miembro, lo que pinta la página
estática con lo que dan `entradas` y `productosDe` (orden y enlaces), leyendo `dist/` tras el build o importando las
funciones puras sacadas a un `.mjs` común. Coste: medio (un archivo de test y, quizá, mover dos funciones). Riesgo:
ninguno; el test falla sin la paridad.

### R2 · Un cambio de estructura deja textos que lo contradicen (proyecto)

El hero seguía presentando «Productos» como sección y «los servicios de sus integrantes» tras ADR 0004; lo encontró
la revisión, no la implementación. **Propuesta:** una línea en `REVIEW.md`: «si el diff quita o mueve una sección,
busca en `src/i18n/textos.ts`, `index.html` y `scripts/paginas-estaticas.mjs` los textos que la nombran». Es criterio
(no hay patrón fijo), así que va a la revisión y no a un check. Coste: una línea.

### R3 · Herramienta de contraste en el repo (proyecto)

Las auditorías del 2026-11-09 y de hoy midieron contraste con scripts de usar y tirar; el de hoy no entendía
`color-mix()` y dio falsos positivos que hubo que comprobar a mano. **Propuesta:** `tools/qa/contraste.cjs` (Playwright)
que resuelva el color con un canvas (entiende `color-mix`), recorra las 42 páginas en claro y oscuro y liste lo que
baja de 4,5:1 (3:1 en texto grande), con una lista de exentos (logotipo, botones deshabilitados). Coste: medio.
Riesgo: ninguno; no entra en `npm run check` (necesita el build y un navegador).

### R4 · Decisión tomada sin preguntar (proyecto)

Al poner Novedades en la cabecera, el enlace a Muro salió de ella sin que la persona lo pidiera (sigue en el pie, y
Novedades incluye las publicaciones). **Propuesta:** confirmarlo ahora con la persona; si no lo quiere, vuelve.

### Gasto de tokens (gw-opt-tokens)

Desde `08c7fe5`: 144 llamadas, 127k de contexto medio (suelo 100k, techo 150k), 3 compactaciones; 18,3M de entrada en
la sesión principal. Subagentes: la revisión de código (fork, Opus, 29 llamadas, 127k de media, 3,7M) y la auditoría
(Sonnet, 30 llamadas, 2,8M); arranque medio 69k.

- **T1 · La fase 1 tras un `/clear`.** La revisión es un fork: hereda el contexto de la sesión (127k por llamada). Si
  se lanza justo después de un `/clear` con la bitácora al día, arranca en ~70k: unos **1,6M menos** por revisión.
  Riesgo: ninguno, la revisión solo necesita el diff y `REVIEW.md`. Forma: en «Siguiente paso» de la bitácora, al
  cerrar el trabajo, «pedir `/clear` y empezar por la fase 1», y una línea en `.claude/gw/gw-opt-tokens.md`.
- **T2 · `scripts/paginas-estaticas.mjs`** se leyó 19 veces (127k arrastrados): sus plantillas van en líneas muy
  largas, así que cada `sed -n` trae mucho. Nota en `.claude/gw/gw-opt-tokens.md`: `grep -n` del caso
  (`pg.ruta === '<ruta>'`) y `sed -n` de 10 líneas, como ya se hace con `global.css`. Riesgo: ninguno.

## For Galivelop-workflow

- **La revisión, en sesión limpia.** `AGENTS.md` del flujo podría decir que la fase 1 empieza tras un `/clear` (la
  revisión en fork hereda todo el contexto). Medido aquí: 3,7M de entrada a 127k por llamada para una revisión que
  solo necesita el diff.
