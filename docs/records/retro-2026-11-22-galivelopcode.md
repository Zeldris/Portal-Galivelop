# Retro 2026-11-22 — GalivelopCode, único producto (ADR 0005)

Lo revisado: los commits de la rama desde `origin/main` (ADR 0005, datos, página `/productos/galivelop-developer`,
leves de la revisión y cambio de texto) y la bitácora. Medida con `gw-opt-tokens` (sesión entera): 215 llamadas en la
sesión principal, contexto medio 125k, techo 165k, 4 compactaciones; subagentes 74 llamadas (Fable 33, a 89k de media).

**Estado:** decidida por la persona el 2026-11-22: P1, P2 y P3 aprobadas (P1 aplicada en `AGENTS.md`, P3 aplicada en la skill `gw-portal`, P1 y P2 para el flujo en «For Galivelop-workflow»); P4 aplazada a la próxima versión en `docs/records/pending.md`; P5 aprobada (`/clear` al cerrar).

## Propuestas

- **P1. El correo de prueba se detecta al subir, no al hacer commit** (proyecto y flujo). El subagente de la página
  escribió en un test un correo que no era de `example.com`; el control de datos privados lo vio solo en el `pre-push`, y arreglarlo pidió reescribir
  dos commits con permiso de la persona (una vuelta entera). Proyecto: el encargo de un subagente que escriba tests
  dice «correos de prueba, solo `@example.com`». Flujo: correr el control de datos privados también en `pre-commit`,
  sobre lo preparado. Riesgo: ninguno (el control ya existe).
- **P2. La bitácora se relee entera** (`docs/handoff.md` 24 veces, 1,34M arrastrados) aunque la regla «Bitácora por
  partes» ya existe. Proyecto: nada nuevo; flujo: `handoff.py show <sección>` para leer una fila o sección sin
  `sed` a mano. Riesgo: ninguno.
- **P3. El informe de `gw-portal` se leyó en la sesión principal** (`informe.txt` 8 veces, 358k arrastrados). Proyecto
  (la skill es del portal): en modo informe, la skill lo resume un subagente y la sesión recibe solo lo que cambia por
  ficha. Riesgo: que el resumen pierda un cambio; contrapeso, el resumen lista cada repo, también los «sin cambios».
- **P4. Barrido de leves** (proyecto): `scripts/paginas-estaticas.mjs` tiene dos leves abiertos (JSON-LD con
  `DeveloperApplication`/`Linux` fijos y el producto repetido en `llms.txt`). Una tarea para la próxima versión que
  los cierre a los dos. Riesgo: ninguno; la persona dejó el JSON-LD como está (2026-11-22), así que puede bastar con el
  de `llms.txt`.
- **P5. Una sesión con tres tareas seguidas** (`gw-portal`, actualización del flujo y ADR 0005) sin `/clear` entre
  ellas: 4 compactaciones. La regla ya existe; no se propone nada nuevo, solo pedir el `/clear` al cerrar esta.

## For Galivelop-workflow

- Control de datos privados también en `pre-commit` (P1).
- `handoff.py show <sección>` (P2).
