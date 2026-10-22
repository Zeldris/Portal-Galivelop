# Skills del proyecto

Skills que Claude Code carga en este repositorio. Cuándo usar cada una:
[`docs/runbooks/skills-y-modelos.md`](../../docs/runbooks/skills-y-modelos.md). Desde el 2026-10-22 son la copia de
**Galivelop-workflow v0.1.0** (antes, el flujo de Tarkor adaptado a mano): no se editan aquí, se actualizan con
`/gw-update`. Lo propio del portal vive en `AGENTS.md` («Notas del portal para las skills»), en `.claude/gw.json`
(`selector.cases`, `designReferences`) y en `.claude/gw/opt-tokens.md`.

| Skill | Origen |
|---|---|
| `selector`, `orchestrate-dealer`, `opt-tokens` | Galivelop-workflow (generalizadas desde Tarkor, el instalador y el portal) |
| `gw-init`, `gw-update`, `gw-doctor` | Galivelop-workflow: aplicar, actualizar y comprobar el flujo |
| `grilling`, `grill-with-docs`, `domain-modeling`, `diagnosing-bugs`, `codebase-design`, `improve-codebase-architecture`, `retro`, `writing-for-agents`, `pr`, `prototype`, `research`, `to-questionnaire` | [mattpocock/skills](https://github.com/mattpocock/skills), licencia MIT ([`LICENSE-mattpocock-skills`](LICENSE-mattpocock-skills)), vía Galivelop-workflow |

## Agradecimiento

Doce de estas skills son de **Matt Pocock** ([mattpocock/skills](https://github.com/mattpocock/skills)). Buena parte
de esta forma de trabajar con agentes (interrogar un plan, modelar el dominio, diagnosticar, diseñar módulos
profundos, la retro) la hemos aprendido gracias a su trabajo. Cada una lleva su mención al principio («Original skill by Matt Pocock») y la licencia MIT
se conserva en [`LICENSE-mattpocock-skills`](LICENSE-mattpocock-skills); al traerlas a otro repositorio, se
mantienen las dos cosas.

## Notas

No se instalan las opcionales del flujo: `opt-ai` (IA local) y `scout-updates`.
