# Retro de «Próximamente» (2026-10-25)

**Estado:** presentada a la persona y aprobada entera; aplicadas T1, T2, T3, R1 y R2.

Lo revisado: los commits de «Próximamente» (`68f5fad`, `5e7a2f8` y los de esta retro) y la bitácora. Medida con
`opt-tokens` (`medir.py --since 080abe3`): 51 llamadas, 124k de contexto medio, 2 compactaciones; la sesión entera,
605 llamadas y 18 compactaciones. El `/code-review` dio 10 hallazgos: 6 arreglados en `5e7a2f8`, 2 leves en
«Pendiente» y 2 que se quedan así por decisión. Los dos de más peso eran de diseño, no de código: slugs cortos que no
casarían con la ficha futura, y nadie que pusiera al día las fases.

## T1 · `/clear` al llegar a `main` (portal, aplicada)

La sesión encadenó varias tareas sin `/clear`: 115k de contexto medio, techo de 141k en cada tramo. Tras subir esto a
`main`, `/clear` y retomar desde la bitácora. Apuntado en `.claude/gw/opt-tokens.md`.

## T2 · CI en una llamada (portal, aplicada)

28 llamadas a `actions_list`, 575k tokens arrastrados. Nota en `.claude/gw/opt-tokens.md`: `list_workflow_runs` con
`perPage: 1` y la rama, solo al cerrar un bloque.

## T3 · Tareas programadas de una vez (portal, aplicada)

`get_trigger` y `update_trigger` devuelven el prompt entero (~4k); 10 llamadas arrastraron ~525k. Nota en
`.claude/gw/opt-tokens.md`: un solo `update_trigger` con el texto completo.

## R1 · Test: cada dato tiene quién lo pone al día (portal, aplicada)

`src/data/tarea-semanal.test.ts` exige que `docs/runbooks/tarea-semanal.md` nombre cada `.json` y cada carpeta de
`src/data/` (salvo `equipo.json`, que va a mano) y tenga un bloque por ficha de `src/data/proyectos/`. Comprobado en
rojo quitando del runbook el bloque PRÓXIMAMENTE y el nombre de la ficha de toVeriAI.

## For Galivelop-workflow

- **R2 · Datos que caducan.** Cuando un cambio añade datos que envejecen (fases, versiones, cifras), el encargo y
  `REVIEW.md` deberían preguntar quién los pone al día y cómo se comprueba. Aquí lo encontró la revisión de fase 1;
  antes, en la implementación, habría costado una línea.
