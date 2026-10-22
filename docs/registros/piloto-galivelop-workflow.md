# Piloto de Galivelop-workflow v0.1.0 en el portal

**Fecha:** 2026-10-22 · **Rama:** `claude/piloto-galivelop-workflow` · **Fase 5** del plan del flujo (primer proyecto
existente). Guía seguida: `Galivelop-workflow/docs/es/aplicar.md` (rama `main`, `603ca36`), apartado «Proyectos
existentes».

**Estado:** flujo aplicado y comprobado en la rama; fase 1 (`/code-review`) hecha y arreglada; fusiones a mano aprobadas por el usuario (2026-10-22: `CLAUDE.md`,
`comprobar.yml` y `requireRetro: false`); pendientes las tres fases antes de `main`.

## Qué se hizo

1. `aplicar.py --init --language es --log docs/traspaso.md --install "npm ci" --check-command "npm run check"
   --protected-branch main --push-to-protected direct --review-mark docs/registros/revisado.txt` con `content`
   = `^docs/`, `\.md$`, `^\.claude/skills/`, `^src/data/`, `^public/` (los dos últimos, para que la tarea semanal
   publique sola). A mano en `.claude/gw.json`: `visibleLanguages`, `selector.cases`, `designReferences`,
   `requireRetro: false`.
2. Copia anterior del flujo (traída de Tarkor el 2026-10-21) sustituida, tras comprobar que el flujo hace lo mismo:
   | Antes | Ahora | Comprobación |
   |---|---|---|
   | `.claude/hooks/session-start.sh` | `.claude/gw/scripts/session-start.sh` | mismo `core.hooksPath` y `npm ci` en la nube (por hash del lockfile en vez de por fecha) |
   | `.claude/hooks/revision-antes-de-main.sh` | `.claude/gw/scripts/revision-antes-de-main.sh` | cubre más: `gh pr`, auto-merge, `update_pull_request` |
   | `tools/qa/recuperar.py` (`<regex>`) | `.claude/gw/scripts/recuperar.py` (`--buscar`) | `--estado` igual; busca el registro en carpetas padre |
   | `tools/qa/es-codigo.sh` (regex fija) | `.claude/gw/scripts/es-codigo.sh` + `content` | `\.md$` es más amplio que los cuatro `.md` de la raíz de antes |
   | `tools/qa/revisado.sh` | `.claude/gw/scripts/revisado.sh` | igual, más `requireRetro` (apagado) |
   | `.githooks/pre-push` (bash 4, `mapfile`) | el del flujo | mismas reglas + marcadores de conflicto; casos en `tools/qa/tests/test-ganchos.sh` |
   | `opt-tokens/medir.py`, `proyecto.md` | `opt-tokens/scripts/medir.py`, `.claude/gw/opt-tokens.md` | notas del portal pasadas tal cual |
   | 14 skills con nota «En este repositorio» | las del flujo | notas → «Notas del portal para las skills» de `AGENTS.md`; filas del `selector` → `selector.cases` |
3. Se queda (propio del portal): `tools/qa/tests/test-ganchos.sh` (reescrito para el gancho del flujo y el `content`
   del portal, con 3 casos de la tarea semanal), `tools/generar-marca.mjs`, `.claude/skills/README.md`,
   `LICENSE-mattpocock-skills`, `.github/workflows/pages.yml`, `REVIEW.md` y `GLOSSARY.md` (ampliados a mano).
4. `*.gw-nuevo`: 14 skills y `pre-push` aceptados (sustitución autorizada); `CLAUDE.md` y `comprobar.yml` fusionados
   a mano y aprobados por el usuario (2026-10-22).
5. **Paso 6 (protección):** commit de prueba en `src/main.tsx` y `git push --dry-run origin HEAD:main`: rechazado
   por el `pre-push` («code changed after the review mark (897b1ff)»). El push real lo paró antes el modo automático
   (F15); `main` sigue en `e3f3058` y el commit de prueba se quitó con `git reset --hard HEAD~1` sin subirlo. La
   subida normal de la rama pasó el `pre-push` («pushing 1 commit(s)», check en verde).
6. `doctor.py`: sin FAIL (un WARN de sesión, ver F11). `npm run check` en verde. `pre-commit --rango` sobre toda la
   historia del portal: sin falsos positivos.

## Fricciones y fallos

- **F1 · `add_repo` cambia la carpeta de trabajo.** Para leer el flujo hizo falta `add_repo`: dijo que el repo «ya
  estaba» en `/home/user/galivelop-workflow` (en minúsculas, no existía) y, tras clonarlo en
  `/home/user/Galivelop-workflow`, la sesión pasó a tenerlo como carpeta principal y cargó su `CLAUDE.md` y su
  `AGENTS.md` como instrucciones, sin `register_repo_root`. La regla «no registrar el flujo como raíz» no basta en la
  nube.
- **F2 · Una copia anterior del flujo da 14 `.gw-nuevo`.** Las skills ya traídas a mano (sin `metadata.version`) no
  se reconocen como del flujo: cada `SKILL.md` queda como propuesta y hay que aceptarlas una a una. No hay un modo
  «adoptar» para un proyecto que ya tenía el flujo de Tarkor.
- **F3 · `.gitignore` oculta la configuración.** El portal ignora `.claude/*` salvo una lista; `.claude/gw.json` y
  `.claude/gw/` quedaban ignorados y ni `aplicar.py` ni `doctor.py` lo avisan. El primer commit habría salido sin
  config ni scripts (y el `pre-push` lo habría rechazado tarde).
- **F4 · `doctor.py` da OK con trabajo pendiente.** «skills: copied workflow skills at version 0.1.0» con 14
  `.gw-nuevo` sin revisar; los `.gw-nuevo` solo los cuenta `aplicar.py --check`.
- **F5 · Ganchos duplicados tras fusionar `settings.json`.** La fusión añade los del flujo y deja los antiguos en los
  mismos eventos (dos `session-start`, dos `recuperar.py --estado`, dos ganchos de PR), y `doctor.py` dice «hooks look
  right». Se borraron a mano.
- **F6 · `--init` no cubre todas las claves que el proyecto decide.** Sin bandera para `visibleLanguages`,
  `designReferences`, `selector.cases` ni `requireRetro`: se editan a mano tras `--init`.
- **F7 · `requireRetro: true` por defecto choca con una regla del proyecto.** El portal pide `/retro` solo en cambios
  grandes; la tabla del paso 1 de `aplicar.md` no lo pregunta, y con el valor por defecto `revisado.sh` bloquea
  cualquier cambio pequeño de código.
- **F8 · No hay sitio para las notas del proyecto en las skills copiadas.** El portal tenía nota «En este
  repositorio» en 9 skills (`research`, `pr`, `domain-modeling`, `prototype`, `grilling`, `retro`…). Solo `opt-tokens`
  (`.claude/gw/opt-tokens.md`), `selector` (`selector.cases`) y `grilling` (`designReferences`) tienen dónde leerlas;
  el resto se pasó a `AGENTS.md`, que la skill no lee en el momento de usarla.
- **F9 · `comprobar.yml` es del flujo pero hay que editarlo.** Su cabecera pide añadir la cadena de herramientas
  (`setup-node`) y el portal necesita además el build; con eso, `aplicar.py --check` sale 1 para siempre («v0.1.0 with
  local edits») y un `/gw-update --update` quitaría `setup-node`.
- **F10 · Falta `LICENSE-mattpocock-skills` en la copia.** Las skills de Matt Pocock dicen «MIT (see
  LICENSE-mattpocock-skills)», pero `aplicar.py` no copia ese archivo a `.claude/skills/`. El portal ya lo tenía; un
  proyecto nuevo quedaría con la referencia rota.
- **F11 · El aviso de sesión no se puede arreglar en la nube.** En claude.ai/code con varios repos la sesión arranca
  en `/home/user`; `doctor.py` avisa siempre y la orden que propone (`cd … && claude`) no existe ahí. Se comprobó que
  de verdad no cargó `.claude/settings.json` (`CLAUDE_CODE_AUTO_COMPACT_WINDOW` no está en el entorno), así que el
  aviso es correcto pero su arreglo no.
- **F12 · `REVIEW.md` existente no recibe nada del flujo.** Se crea si falta y nunca más; al portal le faltaban
  «bash 3.2», «traído de otro repo: contratos de este» e «idiomas visibles», y hubo que comparar a mano con la
  plantilla.
- **F13 · La plantilla de `CLAUDE.md` nombra `.claude/hooks/`**, que el flujo ya no usa (sus ganchos están en
  `.claude/gw/scripts/`).
- **F14 · Probar el `content` del proyecto es cosa de cada proyecto.** Para asegurar que la tarea semanal sigue
  publicando sola hizo falta un test propio que monta un repo con `.githooks/pre-push`, `.claude/gw/scripts/`,
  `.claude/gw/schema/` y `.claude/gw.json` (sin el esquema, `config.py` falla y todos los casos dan 1 por el motivo
  equivocado: el test tiene que comprobar el mensaje, no solo el código de salida).

- **F15 · El paso 6 pide un push real a la rama protegida.** El modo automático de Claude Code lo bloquea como
  «Production Deploy»; `git push --dry-run` ejecuta igual el `pre-push` y prueba lo mismo sin riesgo de subir nada
  si el gancho fallara.
- **F16 · El mensaje esperado del paso 6 no es el de un proyecto existente.** `aplicar.md` espera «the pushed
  commit has no review mark», pero el portal ya tenía marca y el rechazo dice «code changed after the review mark».

- **F17 · `recuperar.py --estado` se cuelga a mano.** Sin entrada estándar espera el JSON del gancho; `CLAUDE.md`
  dice que se corra y en una terminal no termina (con `</dev/null` sí).

## Fase 1: `/code-review` del diff contra `origin/main` (2026-10-22)

10 hallazgos. Arreglados en el portal:

- `content` acotado (hallazgos 2, 3 y 5): fuera `\.md$` y `^\.claude/skills/` del todo (cubrían `medir.py`, los
  `agents/*.yaml` y `.claude/gw/opt-tokens.md`) y `^public/` solo para imágenes (`public/` acaba tal cual en la web,
  HTML incluido). Ahora: `^docs/`, `^src/data/`, `^public/.*\.(webp|png|jpe?g|svg|ico)$`, los cinco `.md` de la raíz
  (`README`, `GLOSSARY`, `REVIEW`, `CLAUDE`, `AGENTS`) y `^\.claude/skills/.*\.md$`.
- Casos nuevos en `test-ganchos.sh` (hallazgo 4): qué es código y qué contenido con ese `content` (una ruta por regla;
  comprobado que falla con el `content` de antes) y el `pre-commit` como agente sobre un commit tipo de la tarea semanal.
- «Para la próxima publicación» pasa a subsección de «Estado actual» de la bitácora (hallazgo 6): `recuperar.py
  --estado` solo devuelve la primera sección.
- `CLAUDE.md.gw-nuevo` se había colado en el commit (hallazgo 9): borrado. `CLAUDE.md` ya no nombra `.claude/hooks/`.

Del flujo (no se tocan sus scripts aquí; van abajo, F18-F23): hallazgos 1, 6, 7, 8 y 10.

- **F18 · Un commit puede ampliar `content` para saltarse la marca** (hallazgo 1, el más grave). `pre-push` y
  `es-codigo.sh` leen `content` del commit que se sube: un commit que añade `".*"` y toca código pasa a `main` sin
  marca, y con la tarea semanal publicando sola nadie lo vería. El gancho antiguo del portal tenía la lista fija.
- **F19 · El `content` por defecto exime código:** `^\.claude/skills/` cubre scripts (`medir.py`) y `\.md$`, las
  instrucciones de los agentes en cualquier carpeta.
- **F20 · `recuperar.py --estado` devuelve solo la primera sección** de la bitácora (el gancho antiguo del portal
  mostraba también lo pendiente de publicar).
- **F21 · Marcadores de conflicto solo en commits nuevos:** subir a la rama protegida commits ya en otra rama remota
  (la tarea semanal: `git push origin <rama>:main`) se salta la búsqueda de marcadores y de `*.rej`/`*.orig`.
- **F22 · `session-start.sh` decide reinstalar solo por el sello de `.git`**, no por si existe `node_modules`; si se
  borra `node_modules` y queda el sello, no reinstala. (En la tarea semanal no afecta: contenedor nuevo y `npm ci` en
  su prompt.)
- **F23 · El gancho de PR corre en cada llamada a Bash** (`^Bash$`), también con `pushToProtected: direct`, y bloquea si
  `python3` falla aunque el comando no tenga que ver con un PR.

## Fase 2: `/opt-tokens` y `/retro` (2026-10-22)

- **F24 · La `retro` del flujo no la puede lanzar Claude.** Trae `disable-model-invocation: true`, pero `AGENTS.md`
  (fase 2), el `selector` («Claude runs it») y `revisado.sh` con `requireRetro` cuentan con que la lance el agente. La
  del portal sí se podía. Hay que pedir al usuario que escriba `/retro`.
- **F25 · Aplicar el flujo cuesta leerlo entero en la sesión principal.** `/opt-tokens` de esta sesión: 62 llamadas,
  171k de contexto medio, techo 237k (la ventana de 200k no se aplicó, F11); lo que más arrastra son `aplicar.md`,
  `config.md`, las plantillas y los scripts leídos para decidir (~30k tokens que viajan en cada llamada posterior).

## For Galivelop-workflow

- **F1:** en `aplicar.md` §0 y en `problemas.md`, cómo leer el flujo en la nube sin que pase a ser la carpeta de
  trabajo (p. ej. `git clone` directo si el repo es público, o volver a abrir la sesión desde el proyecto); y que
  `add_repo` puede dar una ruta en minúsculas que no existe.
- **F2:** `aplicar.py --adopt` (o detección por `metadata.source`/nombre): una skill del mismo nombre sin versión se
  sustituye tras mostrar el diff, y lo que tuviera de más se lista para pasarlo a las notas del proyecto.
- **F3:** `aplicar.py` y `doctor.py` comprueban con `git check-ignore` que `.claude/gw.json`, `.claude/gw/`,
  `.claude/skills/`, `.claude/settings.json` y `.githooks/` no están ignorados (FAIL con la línea a añadir).
- **F4:** `doctor.py` cuenta los `*.gw-nuevo` pendientes (WARN o FAIL) y no da «skills OK» mientras haya alguno.
- **F5:** `doctor.py` avisa de entradas de `settings.json` en los eventos del flujo que apuntan a scripts fuera de
  `.claude/gw/scripts/` (posibles duplicados de una copia anterior), y `aplicar.py` las lista al fusionar.
- **F6/F7:** banderas `--visible-language`, `--design-reference` y `--require-retro true|false` en `--init`, y
  `requireRetro` en la tabla del paso 1 de `aplicar.md` («¿retro en cada subida o solo en cambios grandes?»).
- **F8:** convención de notas por skill que lean las propias skills, p. ej. `.claude/gw/skills/<nombre>.md` («si
  existe, léelo antes de seguir»), creada una vez y del proyecto como `opt-tokens.md`; o una sección fija en
  `AGENTS.md` que las skills citen.
- **F9:** pasos propios del CI en la config (`ci.setup`, `ci.after`) o un `comprobar.yml` que se crea una vez y es del
  proyecto; como mínimo, `setup-node`/`setup-python` según el archivo de construcción, para que no haya que editarlo.
- **F10:** `aplicar.py` copia `LICENSE-mattpocock-skills` a `.claude/skills/` junto con las skills de Matt Pocock.
- **F11:** en la nube (`CLAUDE_CODE_REMOTE=true`), el aviso de sesión explica que la carpeta la pone la plataforma
  y qué comprobar a mano; y mejor detectar si `settings.json` cargó (la variable de compactación en el entorno) que
  mirar la carpeta del registro.
- **F12:** con `REVIEW.md` o `GLOSSARY.md` ya existentes, `aplicar.py` imprime el `diff --no-index` con la plantilla
  (sin escribir nada) para que el agente pase lo que falte.
- **F13:** quitar `.claude/hooks/` de la plantilla de `CLAUDE.md` (o decir `.claude/gw/scripts/`).
- **F15/F16:** el paso 6 de `aplicar.md` con `git push --dry-run origin HEAD:<protectedBranch>` (el gancho corre
  igual y no hay riesgo de subir si fallara), y los dos mensajes posibles: sin marca o con código después de la marca.
- **F17:** `recuperar.py --estado` con la entrada estándar en una terminal (`sys.stdin.isatty()`) no la lee.
- **F18:** `pre-push` y el gancho de PR leen `content` y `reviewMark` del commit **remoto** de la rama protegida (la base),
  no del que se sube, y un cambio en `.claude/gw.json` cuenta siempre como código; con su caso en los tests.
- **F19:** `content` por defecto sin `^\.claude/skills/` entero (solo `.md` de las skills) y con `\.md$` limitado a la
  documentación (`^docs/`, README), no a `AGENTS.md`/`CLAUDE.md` en cualquier carpeta; avisarlo en `aplicar.md` §1.
- **F20:** `--estado` con las secciones que diga la config (p. ej. `logSections`), o la primera y la de pendientes.
- **F21:** al subir a la rama protegida, buscar marcadores y restos en `base..local`, no solo en lo nuevo.
- **F22:** `session-start.sh` reinstala también si falta la carpeta de dependencias (`node_modules`, `.venv`).
- **F23:** el gancho `PreToolUse` en `Bash` solo con `pushToProtected: pr`, o salir antes de lanzar `python3` cuando el
  comando no nombra `gh`.
- **F24:** quitar `disable-model-invocation` de la `retro` del flujo (o cambiar `AGENTS.md`, el `selector` y
  `revisado.sh` para que digan que la lanza el usuario).
- **F25:** un resumen para agentes de lo que hay que decidir al aplicar a un proyecto existente (una página con las
  claves, los valores por defecto que suelen chocar y qué archivos del proyecto se tocan), o `aplicar.py --explain`,
  para no leer guía, config, plantillas y scripts enteros.
- **F14:** un `es-codigo.sh --explicar <ruta>...` (código o contenido y qué regex casa) y un ejemplo de test de
  `content` en `docs/es/patrones.md` para proyectos con tareas que publican solas.
