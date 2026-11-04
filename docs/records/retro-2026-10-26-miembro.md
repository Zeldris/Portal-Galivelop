# Retro de la página de miembro y los encargos (2026-10-26)

**Estado:** presentada a la persona y aprobada entera; aplicadas P1, P2, P3, R1 y R2.

Lo revisado: los commits de la rama `ccr-47f8fddd-o5ek6p` desde `94fb94f` (ADR 0001 de encargos, página de miembro,
tecnologías con iconos, trayectoria por empresa, destacadas solo en la tarjeta corta) y la bitácora. Medida con
`opt-tokens` (`medir.py --since 94fb94f`): 260 llamadas, 128k de contexto medio (suelo 114k, techo 141k), 17
compactaciones; 4 subagentes con 9,1M de entrada y 74k de arranque. Dos rondas de `/code-review`: 18 hallazgos y 9.

## P1 · Los repos hermanos no se cargan en la sesión principal (portal, aplicada)

Con cuatro repos más en `/home/user` (añadidos con `add_repo`), cada llamada lleva sus `CLAUDE.md`/`AGENTS.md` y sus
listas de skills: ~15k de contexto fijo, por eso el suelo tras compactar es de 114k y cada subagente arranca en 74k.
Apuntado en `.claude/gw/opt-tokens.md`: para leer otro repo, un subagente lo clona en el scratchpad sin registrarlo.

## P2 · `textos.ts` por clave (portal, aplicada)

Se leyó 30 veces (128k arrastrados). Apuntado en `opt-tokens.md`: `grep -n` por clave y `sed -n` del rango.

## P3 · `/clear` tras `main` (portal, ya en vigor)

La regla existía, pero la sesión encadenó tareas desde el 2026-10-25 (983 llamadas, 38 compactaciones). No hay regla
nueva: tras subir a `main`, la sesión lo pide en una línea, como ya hace la 0.4.0 del flujo.

## R1 · Navegadores soportados, en `REVIEW.md` (portal, aplicada)

La revisión marcó `Object.hasOwn` por Safari 15.0–15.3, pero Vite 8 compila para `baseline-widely-available`
(Safari e iOS 16.4+, Chrome y Edge 111+, Firefox 114+): el hallazgo no aplicaba. `REVIEW.md` ya lo dice.

## R2 · `FONDO_PILDORA` atado a `global.css` (portal, aplicada)

El número de `IconoTecnologia.tsx` se calculaba a mano desde `--superficie` y `--brillo`, y la primera vez se midió
sobre el token equivocado (`--fondo`). Ahora un test de `src/data/equipo.test.ts` lee los dos tokens de cada tema y lo
recalcula; falla con el valor viejo (0.8119) por el motivo.

## For Galivelop-workflow

- **Repos que solo se leen, fuera de la sesión principal.** En la nube, `add_repo` + `register_repo_root` carga el
  `CLAUDE.md`/`AGENTS.md` y las skills de cada repo en todas las llamadas (y en el arranque de cada subagente). La guía
  de `orchestrate-dealer` (leer otros repos con un subagente) podría decir que el subagente clona en el scratchpad
  sin registrar el repo, y `doctor.py` avisar de repos hermanos registrados en la sesión.
- **El objetivo de navegadores en la plantilla de `REVIEW.md`**: un hueco «Navegadores: …» que rellena el proyecto,
  para que la revisión no marque compatibilidad fuera del objetivo de compilación.
