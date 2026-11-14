<!-- galivelop-workflow v0.6.0 -->
@AGENTS.md

## Solo para Claude Code

- Responde en el idioma del proyecto (`es`).
- Al empezar cada tarea, di en una línea qué skill y qué modelo pide el caso, con la skill `gw-selector` (las filas del
  portal están en `selector.cases` de `.claude/gw.json`). El modelo de la sesión lo elige la persona; los subagentes,
  el más barato que haga bien el trabajo. Flujo completo: [`docs/runbooks/skills-y-modelos.md`](docs/runbooks/skills-y-modelos.md).
- **Compactación:** `.claude/settings.json` fija la ventana de compactación automática. Tras una compactación o un
  `/clear`, el gancho de inicio corre `python3 .claude/gw/scripts/recover.py --state`, que devuelve el estado de
  la bitácora y los últimos commits; un detalle perdido se busca con
  `python3 .claude/gw/scripts/recover.py --search "<texto>"`. Lo que tenga que sobrevivir va a `docs/handoff.md`.
- **El modo automático** puede pedir permiso para editar `.claude/settings.json`, `.claude/gw/scripts/` y `.githooks/`:
  pide permiso a la persona antes de tocarlos, o que la propia persona haga el cambio.
