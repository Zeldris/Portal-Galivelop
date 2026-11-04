# Retro del muro (2026-10-25)

**Estado:** presentada a la persona y aprobada entera; aplicadas P1, P2 y P3.

Lo revisado: los commits del muro (`b9b0c3d`, `c432559` y los de esta retro) y la bitácora. Medida con
`opt-tokens` (`medir.py --hours 3`): 117k de contexto medio por llamada, 6 compactaciones; sin desvíos grandes. Lo caro
fueron las llamadas repetidas con la vista previa y la revisión de fase 1, que encontró dos fallos de lógica en el paso
de la tarea semanal (un runbook, que es contenido y no lo prueba ningún test).

## P1 · `npm run medir` arranca su propio servidor (portal, aplicada)

`vite preview` se lanzaba a mano y se paraba con `pkill -f "vite preview"` en la misma orden, que mataba también el
shell (exit 144): tres llamadas perdidas y un archivo sin escribir. `tools/qa/medir-paginas.cjs` arranca ahora
`vite preview` si no hay nada en el puerto 4173, lo para al acabar (el grupo entero: matar `npx` dejaba vivo `vite`)
y mide también `/muro`.

## P2 · Reglas del muro probadas con un ejemplo (portal, aplicada)

Los tests de cada publicación solo corrían si había publicaciones; hoy no hay ninguna y la primera la escribe la tarea
semanal sin revisión. Las reglas están ahora en una función del test (`problemas`) con un ejemplo bueno y uno malo que
comprueba cada motivo.

## P3 · Servidores y `pkill -f` (flujo, aplicada como propuesta)

Ver abajo.

## For Galivelop-workflow

- Aviso para `orchestrate-dealer` u `opt-tokens` (o la guía de herramientas del flujo): nunca `pkill -f <patrón>` en
  una orden que contenga ese patrón en otra parte (el shell que la corre también casa y muere, exit 144). Los
  servidores, con `run_in_background` o arrancados y parados por el propio script que los usa.
- Los runbooks de las tareas programadas son «contenido» para la regla de `main`, pero son el programa de un agente
  sin supervisión: la revisión del muro encontró en uno dos fallos de lógica (piezas que nunca se publicarían). Valorar
  que el `/code-review` de la fase 1 los lea como código aunque `content` los cubra.
