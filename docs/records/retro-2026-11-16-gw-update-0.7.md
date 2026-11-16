# Retro: `/gw-update` 0.6.0 → 0.7.0 (2026-11-16)

**Estado:** aprobada por la persona (2026-11-16): P1 y P2 aplicadas como tareas suyas (archivo de tareas abiertas); P3 decidida para el flujo, en «For Galivelop-workflow».

Lo revisado: c7d8cbc (flujo 0.7.0) y f831a2a (fase 1, 0 hallazgos). Gasto medido con `measure.py --since b17058f`:
63 llamadas, todas con el modelo grande, contexto medio 122k (techo 160k, sin compactar), contexto de arranque 86k
(88 % sistema, herramientas y MCP).

## Propuestas

- **P1 (proyecto, la persona) — abrir la sesión desde el repo.** Las dos sesiones de hoy se abrieron en `/home/user`:
  no se cargan `.claude/settings.json` ni sus ganchos (ya pendiente desde la retro del 2026-10-30, entrada de
  `pending.md`). Ahorro: el tope de compactación y el gancho de arranque vuelven a funcionar. Riesgo: ninguno.
- **P2 (proyecto, la persona) — conectores sin usar fuera de la sesión del portal.** 75k de los 86k de arranque son
  sistema y herramientas; Claude Docs y otros conectores no se usan en el portal. Quitarlos del entorno ahorra en
  cada llamada (~10-20k × 63). Riesgo: si una tarea necesita uno, se vuelve a activar.
- **P3 (flujo) — `/gw-update` lee el repo del flujo en un subagente.** `AGENTS.md` ya lo pide («otros repositorios
  se leen con un subagente») y no se siguió: la salida del ensayo de `apply.py` (187k arrastrados), el `SKILL.md`
  (129k), el diff de plantillas (110k) y el CHANGELOG (94k) entraron en la sesión principal, ~520k en total. Lo
  arregla la skill `gw-update`: un paso que encarga a un subagente barato el resumen del ensayo, del CHANGELOG y
  del diff de plantillas, con rutas. Riesgo: que el resumen pierda un cambio de plantilla; contrapeso, la fase 1 ya
  revisa lo fusionado a mano.

Barrido de leves: este bloque no tocó código de la web; ningún script del flujo tiene dos o más leves abiertas en
`pending.md`. No se propone tarea `B`.

## For Galivelop-workflow

- `gw-update`: delegar a un subagente la lectura del ensayo de `apply.py --update`, del CHANGELOG y del diff de
  plantillas, y que `apply.py --update --dry-run` dé un resumen corto por defecto (P3).
- `check.py`: no admite guiones en `r/u_…` para los canales de Reddit (visto el 2026-11-14).
- Sesión abierta fuera del repo: `recover.py` solo lo avisa en stderr; que el primer mensaje del agente lo diga
  siempre (hoy se dijo a mano).
