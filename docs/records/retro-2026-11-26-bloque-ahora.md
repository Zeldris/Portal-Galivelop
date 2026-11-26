# Retro: bloque «Ahora» del roadmap (R-1 a R-6 y R-3b) antes de `main`

**Fecha:** 2026-11-26 · **Rama:** `ccr-1c3b5b63-tdttd6` (d80f965..bbc061a, 18 commits, 67 archivos) ·
**Revisión:** bloque sin graves ni medios (ea2f08e, `Findings: 0`), marca bbc061a, CI en verde.

**Estado:** aprobada (2026-11-26, la persona: «Seguimos tus recomendaciones»); P3, P4 y P5 aplicadas; P1 y P2 aplazadas a
tareas apuntadas en `pending.md`; la propuesta para el flujo, decidida, queda abajo para `gw-harvest`.

## Medida (`gw-opt-tokens`, desde d80f965)

- Sesión principal: 119 llamadas, contexto medio 131k (suelo 104k, techo 165k), **2 compactaciones con presupuesto 1**;
  el arranque fijo (sistema, herramientas, MCP) es el 69 % de la entrada (~90k por llamada, ya conocido: Q-22).
- 10 subagentes `sonnet` (7 `gw-worker`, 3 `gw-reviewer`): 197 llamadas, 8,6M de entrada; arranque medio 20k.
- Frente a la línea base del 2026-11-25 (254 llamadas, 119k de media): menos de la mitad de llamadas en la sesión
  principal para siete tareas de código; el reparto a subagentes funcionó.
- Lo más arrastrado en la principal: un `grep` de `pending.md` (120k arrastrados), `git show 339d3f0 | head -120`
  para mirar el diff de un subagente (80k), la bitácora leída 11 veces (107k) y `pending.md` 9 veces (99k).

## Propuestas (por gravedad)

### P1. La medida de LCP no comprueba que la página servida sea la estática (proyecto, comprobación automática)

Las cifras de R-3 se apuntaron como válidas y no lo eran: `vite preview` servía la app vacía para `/proyectos/<slug>`
sin barra final, y nadie lo vio hasta R-3b. `tools/qa/auditar-rendimiento.cjs` sigue igual. **Cambio:** que pida la
ruta con barra final (la que sirve GitHub Pages) y falle si el HTML recibido no trae el contenido estático
(`data-estatico`), con el motivo en el mensaje. **Coste:** pequeño, con test. **Riesgo:** ninguno; evita volver a
apuntar cifras falsas.

### P2. Barrido R-7 de `src/estilos/leer-estilos.ts` (proyecto, barrido de leves)

Es el script con más leves abiertos del bloque (dos entradas de `pending.md`): (a) `hojasDeEstilos()` solo reconoce
`@import './x.css';` con comillas simples; (b) no falla con 0 hojas; (c) no detecta una hoja de `src/estilos/`
olvidada en `global.css` (comparar con `readdirSync`). Una tarea para la próxima versión, con tests rojos sin el
arreglo. **Riesgo:** ninguno.

### P3. Quitar de `pending.md` lo que ya hizo el bloque (proyecto, navegación)

«Barrido de leves de `global.css`» (retro 2026-11-25, R2) lo cerró R-4 (339d3f0, 1303068) y sigue apuntado; la
entrada del roadmap dice «Ahora, en curso». Con la subida a `main`: quitar la primera y marcar «Ahora» como hecho.
**Riesgo:** ninguno; cada lectura de `pending.md` deja de llevar texto muerto.

### P4. La sesión principal no lee el diff de un subagente con `git show` (tokens)

Mirar el diff de R-4 en la principal costó 80k arrastrados; ese trabajo ya lo hace el revisor de bloque. **Cambio** en
`.claude/gw/gw-opt-tokens.md`: la principal lee `git show --stat` y el resumen del subagente; si duda de un punto,
`git show <sha> -- <archivo>` de ese archivo solo. **Riesgo:** bajo, porque lo cubre la revisión de bloque.

### P5. Nueva línea base en `.claude/gw/gw-opt-tokens.md` (tokens)

La de arriba (119 llamadas, 131k de media, 2 compactaciones, 10 subagentes, 8,6M), para comparar la próxima tanda.

## For Galivelop-workflow

- La sesión se abrió en `/home/user` y no en el repo, así que no cargó `.claude/settings.json` ni sus ganchos.
  `recover.py --state` no lo dice; solo avisa de que no le llegó `transcript_path`. Propuesta: que `recover.py --state`
  diga «sesión abierta fuera del repo» cuando la carpeta de la sesión no es la raíz del repo, con lo que hay que hacer.
