# Retro: piloto de Galivelop-workflow v0.1.0 en el portal

**Fecha:** 2026-10-22 · **Rama:** `claude/piloto-galivelop-workflow` · **Revisado:** `git log origin/main..HEAD`
desde `84b27d1` hasta `7dfa637` (5 commits del piloto; 72 archivos, +4681/−987 contra `origin/main`) y la bitácora.
Fricciones de detalle: [`piloto-galivelop-workflow.md`](piloto-galivelop-workflow.md) (F1-F26); aquí no se repiten.

**Estado:** aplicadas todas las propuestas (decisión del usuario, 2026-10-22): 1 y 3-8 en el portal; la 2 (prompt de la tarea
programada) solo se puede cambiar desde la conversación de la tarea: pendiente de que el usuario la pida allí, con el
texto de abajo y las del flujo en «For Galivelop-workflow», abajo, para `gw-harvest`.

## Qué fue bien

- **La protección de `main` se probó de verdad y sin riesgo.** El paso 6 con un commit de código de prueba y
  `git push --dry-run origin HEAD:main`: el `pre-push` lo rechazó («code changed after the review mark»), `main`
  siguió en `e3f3058` y el commit de prueba no salió del contenedor. El modo automático paró el push real (F15) y el
  `--dry-run` probó lo mismo.
- **El `/code-review` rindió.** 10 hallazgos sobre el diff contra `origin/main`: 5 del portal arreglados en `8674ca0`
  (`content` acotado, casos de clasificación y de `pre-commit`, la sección de publicación dentro de «Estado actual»,
  el `CLAUDE.md.gw-nuevo` colado) y 5 del flujo apuntados (F18-F23). El más grave (F18: un commit que amplía
  `content` se salta la marca) es justo el tipo de fallo que la regla «Ganchos y scripts» de `REVIEW.md` manda mirar.
- **El test de los ganchos ya es del portal.** `tools/qa/tests/test-ganchos.sh` prueba el gancho del flujo con el
  `content` real: 11 casos de la regla de `main` (3 de la tarea semanal), la clasificación ruta a ruta y el
  `pre-commit` con un commit tipo. Se comprobó que falla con el `content` de antes.
- **Relevos al día.** Cada commit con bitácora, cuerpo con qué queda y `Siguiente:`; ningún trabajo solo en local.
- **Ninguna referencia rota** a las rutas antiguas (`tools/qa/recuperar.py`, `.claude/hooks/`, `opt-tokens/proyecto.md`)
  fuera de los registros históricos.

## Qué costó

- **Un test que falló por el motivo equivocado.** Sin `.claude/gw/schema/` en el repo de prueba, `config.py` fallaba y
  todos los casos daban 1: los «tiene que rechazar» pasaban sin probar nada. Se arregló copiando el esquema y
  comprobando el mensaje (5.º argumento de `caso`), pero nada obliga a que un caso nuevo lleve motivo.
- **`.gitignore` ocultaba la configuración** (`.claude/*` salvo lista): `.claude/gw.json` y `.claude/gw/` no se
  habrían subido. Se vio a tiempo, a ojo; ningún check del portal lo habría parado (F3).
- **`recuperar.py --estado` se colgó** al correrlo a mano, esperando el JSON del gancho por la entrada estándar (F17).
  `CLAUDE.md` lo nombra sin decir cómo correrlo en una terminal.
- **El flujo se leyó en la sesión principal**, no con un subagente: `aplicar.md`, `config.md`, plantillas y scripts
  (~30k tokens que viajan en cada llamada; 171k de contexto medio, techo 237k, F25). El `selector` tiene la fila
  «Bring something from another repo → `orchestrate-dealer`, the main session never reads the files whole», pero
  `add_repo` dejó el flujo como carpeta de trabajo (F1) y `gw-init` no remite a esa fila.
- **El `content` de partida era demasiado ancho** (`\.md$`, `^\.claude/skills/`, `^public/` enteros) y lo cazó la
  revisión, no un check. Tras el arreglo, el test fija la clasificación de unas rutas, pero no el `content` en sí.
- **La retro no la pudo lanzar el agente** (F24): hubo que pedírsela al usuario.

## Cómo rindieron las skills

| Skill | Rendimiento |
|---|---|
| `selector` | Se aplicó al empezar, pero sus tres filas del portal (`selector.cases`) dicen `skill: none`, también la de traer contenido de otro repo, que según `AGENTS.md` se lee con un subagente. No hay fila para aplicar o actualizar el flujo. |
| `orchestrate-dealer` | No se usó para leer el flujo, que era su caso («when bringing material from another repo»). Es el mayor gasto de la sesión (F25). |
| `opt-tokens` | Midió bien (62 llamadas, 171k medio) y sus propuestas se presentaron. No relaciona la cifra con el umbral de ~150k de `orchestrate-dealer` ni señala qué lecturas tendría que haber hecho un subagente. |
| `code-review` | El punto fuerte: 10 hallazgos, el más grave de seguridad del flujo (F18). |
| `retro` | `disable-model-invocation` (F24); por lo demás, su sección «In a Galivelop-workflow project» bastó para saber dónde y cómo escribir esto. |

## Propuestas

Por gravedad.

1. **Proyecto · fijar `content`, `check`, `reviewMark`, `protectedBranch` y `pushToProtected` en el test** (ampliado
   en la fase 3: solo frena un cambio accidental; uno deliberado que toque también el test pasa, y eso es F18) (`tools/qa/tests/test-ganchos.sh`). Comparar el `content`
   y el `reviewMark` de `.claude/gw.json` con una copia literal en el test; si difieren, el check falla. Mitiga F18
   mientras el flujo no lo arregle: `npm run check` corre en el `pre-push`, así que un commit que amplíe `content`
   (también de la tarea semanal) se para, y cambiarlo a propósito obliga a tocar el test, que se ve en el diff.
2. **Proyecto · el prompt de la tarea «Tarkor semanal»** (tarea programada, fuera del repo; pide el visto bueno del
   usuario): «solo toca `src/data/`, `public/` y `docs/`; si hace falta tocar `.claude/`, `.githooks/` o `src/` fuera
   de `src/data/`, no publiques y apúntalo en la bitácora». Es la que publica sin revisión.
3. **Proyecto · lo versionado del flujo, no ignorado** (`tools/qa/tests/test-ganchos.sh`): `git check-ignore -q` sobre
   `.claude/gw.json`, `.claude/gw/scripts/config.py`, `.claude/skills/retro/SKILL.md`, `.claude/settings.json` y
   `.githooks/pre-push`; si alguno está ignorado, falla con la ruta. Versión local de F3.
4. **Proyecto · un rechazo siempre con su motivo** (`tools/qa/tests/test-ganchos.sh`): `caso` falla si espera 1 y no
   recibe el 5.º argumento; y el `pre-commit` del final muestra su salida al fallar en vez de mandarla a `/dev/null`.
   Convierte en comprobación la lección del esquema.
5. **Proyecto · `selector.cases`** (`.claude/gw.json`): la fila «Contenido de un proyecto … a partir de su repo» pasa a
   `skill: orchestrate-dealer` (lectura del otro repo con subagente ligero, como dice `AGENTS.md`).
6. **Proyecto · `AGENTS.md`, «Reglas del proyecto»**: una línea en la diferencia con el flujo: «`/retro` la escribe el
   usuario (la skill no la puede lanzar el agente); al cerrar la fase 1 de un cambio grande, pídesela». Se quita cuando
   el flujo resuelva F24.
7. **Proyecto · `CLAUDE.md`, punto de compactación**: «a mano, `python3 .claude/gw/scripts/recuperar.py --estado
   </dev/null`» hasta que se arregle F17.
8. **Proyecto · bitácora y registro al día** (`docs/traspaso.md`, `docs/registros/piloto-galivelop-workflow.md`): la
   entrada 🚧 del piloto en «Hecho» y el punto 1 de «Qué se hizo» citan el `content` de antes de la fase 1
   (`\.md$`, `^\.claude/skills/`, `^public/`); poner el actual o remitir a «Fase 1». La celda «Siguiente paso» repite
   `/opt-tokens` y `/retro` dos veces. (La sesión principal está editando la bitácora: lo aplica ella.)

## Texto para la propuesta 2 (pendiente)

Añadir al principio de «Reglas:» del prompt de «Tarkor semanal», en la sesión «Tarkor semanal (portal)»:

> SOLO cambias archivos de src/data/, public/ (imágenes) y docs/; si para hacer la revisión hiciera falta tocar
> cualquier otra ruta (src/ fuera de src/data/, .claude/, .githooks/, scripts, package.json…), no la toques ni
> publiques ese cambio: apúntalo en «Para la próxima publicación» de docs/traspaso.md y dilo en la respuesta (el
> pre-push rechaza en main el código sin revisar).

## For Galivelop-workflow

Solo lo nuevo; lo demás ya está en «For Galivelop-workflow» del registro del piloto (F1-F26).

- **`gw-init` reparte la lectura del flujo** (amplía F1 y F25): la skill (y `aplicar.md` §0) manda leer el repo del
  flujo con un subagente ligero vía `orchestrate-dealer`, que devuelve la tabla de decisiones del paso 1 y los
  conflictos con el proyecto, con rutas; la sesión principal solo decide. Hoy la fila del `selector` existe pero
  `gw-init` no la cita, y la sesión leyó el flujo entero.
- **`selector`: fila «Aplicar o actualizar el flujo»** (`gw-init`, `gw-update`, `gw-doctor`), con modelo grande para
  decidir y subagente ligero para leer; ninguna fila cubre hoy el caso que más contexto gasta.
- **`opt-tokens` compara con el umbral de `orchestrate-dealer`**: si el contexto medio pasa de ~150k, el informe lo
  dice y lista las lecturas grandes que tendría que haber hecho un subagente (aquí, las del flujo).
- **Patrón de test del `content`** (amplía F14 y F18): en `docs/es/patrones.md`, fijar `content`/`reviewMark` en el
  test del proyecto (propuesta 1) como defensa hasta F18, y que todo caso que espera rechazo compruebe el mensaje
  (propuesta 4); llevar esa regla también a la plantilla de `REVIEW.md` («un test que espera fallo comprueba el
  motivo»).
