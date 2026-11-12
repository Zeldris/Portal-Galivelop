# Retro: reutilizar lo generado y hoja del generador del 2026-11-12

Commits revisados: 488dc0e, 0d5aa12, 7fc0357 y e8af64b (rama `ccr-47f8fddd-o5ek6p`), y la bitácora.

**Estado:** pendiente: lo decide la persona.

## Medida (`gw-opt-tokens`, desde 87940a6)

104 llamadas en la sesión principal, contexto medio 125k (techo 166k), 2 compactaciones con un presupuesto de 1.
Subagentes: 3, con 3,0M de entrada (2,5M de un `general-purpose` en Opus). Lo más arrastrado:

- `docs/marca.md`: 13 lecturas, 252k arrastrados.
- `hoja.md` del generador, leída 3 veces con `git show` en la sesión principal aunque un `Explore` ya la había
  resumido: 250k.
- `src/estilos/global.css`: 28 lecturas, 154k.
- 13 imágenes (hojas de contacto y capturas): 457k.

## Propuestas

Por gravedad. Cada una dice adónde va.

### P1. Comprobar que no quedan clases CSS sin uso (proyecto)

La revisión encontró las reglas `.avatar` de `global.css` sin nadie que las usara: el cambio las dejó muertas y
ningún check lo vio. Es mecánico, así que va a un test, no a `REVIEW.md`: `src/estilos/clases.test.ts` saca los
selectores de clase de las hojas de `src/` y busca cada nombre en `src/**/*.tsx`, `index.html` y
`scripts/`. Las clases que se montan dinámicamente se listan con su motivo.

- Coste: un test de ~40 líneas y la primera lista de excepciones.
- Riesgo: falsos positivos con nombres compuestos (`` `tarjeta-${x}` ``); la lista de excepciones los cubre.

### P2. Leer `docs/marca.md` por secciones (proyecto, `gw-opt-tokens.md`)

Igual que `proyectos.md`: `sed -n '/^## Alcance/,/^## /p' docs/marca.md`. Entero, solo la primera vez en la tarea.
Para encontrar la sección, `grep -n '^##' docs/marca.md`.

- Ahorro: ~200k arrastrados por sesión de marca.
- Riesgo: ninguno.

### P3. El resumen de otro repo trae el texto que se va a aplicar (flujo)

El `Explore` devolvió un resumen y la sesión volvió a leer la hoja tres veces para aplicarla al pie de la letra.
Cuando la tarea es **aplicar** un documento de otro repo, el encargo del subagente pide los puntos numerados con
su texto literal (no un resumen) y las rutas. La sesión trabaja sobre esa lista.

- Destino: `gw-orchestrate-dealer` («bring something from another repo»); va a `## For Galivelop-workflow`.
- Ahorro: ~250k.
- Riesgo: una devolución más larga (~5k), menor que tres lecturas arrastradas.

### P4. Node en el PATH de la sesión (máquina, `.claude/settings.local.json`)

El primer `git push` falló porque `npm` no estaba en el PATH: el node está en el scratchpad (memoria «Node en esta
máquina»). Cada orden tiene que exportarlo a mano. Propuesta: poner `env.PATH` en `.claude/settings.local.json`,
que no se sube. Así el gancho `pre-push` y `check.sh` lo encuentran siempre.

- Riesgo: el scratchpad cambia de ruta en cada sesión. Mejor un node fijo en `~/.local/node` (una descarga) y apuntar
  ahí.
- La persona toca la configuración, o da permiso (`CLAUDE.md`).

### P5. Tres tareas sin `/clear` (sin cambio)

Esta sesión pasó de imágenes a `main` a «reutilizar» y a la hoja sin `/clear`, y se salió del presupuesto (2 frente a
1). La regla ya está en `AGENTS.md` y `recover.py --state` avisó. No se propone nada nuevo: tras esta subida a
`main`, `/clear`.

## For Galivelop-workflow

- P3: en `gw-orchestrate-dealer`, cuando la tarea es aplicar un documento de otro repo, el subagente devuelve los
  puntos con su texto literal y las rutas, no un resumen, para que la sesión principal no vuelva a leerlo.
