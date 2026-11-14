<!-- galivelop-workflow v0.6.0 -->
# Portal-Galivelop — instrucciones para agentes

Este proyecto se trabaja por relevos: una sesión puede acabarse en cualquier momento (tokens, contenedor, cambio de
cuenta) y la siguiente tiene que seguir **sin perder nada y sin preguntar por dónde iba**. Todo lo de este archivo
existe para eso. El flujo es Galivelop-workflow v0.6.0; sus scripts están en `.claude/gw/scripts/`, sus skills
en `.claude/skills/` y su configuración en `.claude/gw.json` (solo la lee `.claude/gw/scripts/config.py`).

## Al empezar cualquier sesión

1. Lee la bitácora, `docs/handoff.md`: rama, tarea en curso, qué falta y siguiente paso.
2. `git fetch origin <rama>` y comprueba que el último commit coincide con lo que dice la bitácora.
3. Comprueba que el check está en verde antes de tocar nada: `npm run check`.
4. Sigue por el **siguiente paso** de la bitácora, salvo que la persona pida otra cosa.
5. Al empezar cada tarea, trae la rama protegida: `git fetch origin main` y, si trae commits,
   `git merge origin/main` (merge, nunca rebase: las ramas están subidas). Si el conflicto toca la
   misma lógica por los dos lados, se para y se consulta a la persona.
6. **La sesión se abre con el repo como carpeta de trabajo.** Abierta en otra (una que contiene varios repos, la
   carpeta personal), no carga `.claude/settings.json`: ni el tope de compactación, ni el gancho de inicio, ni el que
   vigila la subida a la rama protegida. Si pasa, dilo a la persona para que la reabra desde el repo; mientras tanto,
   `git config core.hooksPath .githooks` antes del primer commit y, antes de subir a `main` o de crear
   o fusionar un pull request, comprueba a mano lo que comprobaría ese gancho: la marca de revisión del mismo commit y
   el CI en verde.

## Relevos: commit y push constantes

Cada sesión puede correr en un contenedor temporal: **lo que no está subido no existe** para la siguiente.

- Commit + push en cada punto estable (check en verde). **Nunca más de 30-45 minutos de trabajo sin subir.** Las
  tareas grandes se parten en pasos pequeños con su propio commit.
- **La bitácora se actualiza en el mismo commit** que el trabajo que describe, no al final de la sesión.
- **El estado vive en los archivos, no en la conversación**: el plan dice qué está implementado y la bitácora qué se
  está haciendo. Una tarea a medias dice qué está hecho y qué falta.
- Si hay que parar con algo a medias o en rojo: commit igualmente con `WIP:` al principio del mensaje y, en la
  bitácora, qué falla y por qué. Nunca dejar trabajo solo en local.
- Push a la rama de trabajo (`git push -u origin <rama>`); si falla por red, reintentar con espera 2, 4, 8 y 16 s.
  El push y el check largo se lanzan en segundo plano y se espera su aviso, sin bucles de espera.
- **Tras una llamada interrumpida o rechazada, `git status` y `git diff` antes de repetirla**: el cambio puede
  haberse guardado, o incluso subido, y repetirlo lo duplica.
- Si la persona dice que se para, se para: se sube lo que haya, se deja la bitácora al día y no se sigue con nada más.
- **Al cerrar cada tarea o PR** (y cada fase), con todo subido y la bitácora al día, se pide a la persona un `/clear` en
  una línea, con el porqué: el contexto largo es casi todo el gasto, y la bitácora basta para retomar.
- **Al cerrar cada bloque o fase, mira el CI de la última subida.** Un CI que no arranca (sin cuota, sin runners)
  cuenta como rojo: se dice a la persona y no se da nada por comprobado en el CI. Entonces vale el check pasado en
  local sobre el mismo commit (el de `.githooks/pre-push`) **solo si la persona lo confirma**, y se dice y se apunta en
  la bitácora como «comprobado solo en local». Un CI que arrancó y falló nunca se sustituye así.

## Comprobar

- **El check del proyecto:** `npm run check`. `.githooks/pre-push` lo corre sobre el commit que se sube a
  `main` o que cambia el entorno; a otra rama, solo los tests relacionados (`branchCheck`). El CI
  (`.github/workflows/check.yml`) lo corre entero en cada pull request y, salvo con `ciOnPush: false`, en cada
  push fuera de `main`.
- **Antes de subir a `main`, pásalo con `bash .claude/gw/scripts/check.sh`**: corre el check y, si sale
  en verde, lo apunta; el `pre-push` no lo repite sobre el mismo árbol (`GW_CHECK_CACHE=0` lo desactiva).
- **Lo comprobable lo hace un script**, no un agente: las skills y guías solo deciden lo que exige criterio. Si una
  regla se sigue rompiendo, se convierte en una comprobación.
- **Lo que depende de una máquina concreta no se da por probado con tests** (otro sistema operativo, un dispositivo,
  el equipo de la persona): se apunta como pendiente en el plan, con quién lo comprueba y dónde.
- Un test nuevo tiene que fallar sin su arreglo: `bash .claude/gw/scripts/red-without-fix.sh "<orden del test>"
  <archivo-del-arreglo>...`.
- Un test que espera un fallo comprueba **el motivo** (el mensaje o la causa), no solo el código de salida: si no,
  pasa también cuando falla por otra razón.
- `python3 .claude/gw/scripts/doctor.py` dice si el flujo está bien montado, con la orden que arregla cada problema.

## Mensajes de commit

- Primera línea: qué cambia, en el idioma del proyecto, con los identificadores de las tareas tocadas. Con
  `commitFormat: "conventional"` en `.claude/gw.json`, en la forma `tipo(id): …` (`feat`, `fix`, `docs`…), y con
  `commitRefs: true`, un trailer `Refs: <id>` en el último párrafo, antes de `Siguiente:`; lo comprueba `commit-msg`.
- Cuerpo: qué se hizo, qué queda de esa tarea si no está cerrada, y estado del check.
- **Última línea: `Siguiente: <próximo paso concreto>`**, en el mismo bloque final que las líneas de atribución, si las hay.
- El commit con los arreglos de una revisión lleva `Findings: <n hallazgos aceptados>` y el de un trabajo que tuvo
  que subir de peldaño, `Retries: <n>` (los lee `metrics.py quality`).
- Con `agentSignatures: false` en `.claude/gw.json`, el commit **no lleva firmas del agente** (ni `Co-Authored-By` de
  Claude, ni `Claude-Session`, ni «Generated with Claude Code», ni enlaces de sesión) y el gancho `commit-msg` rechaza
  el mensaje que las traiga.

## Ramas y `main`

- Se trabaja en la rama que indique la bitácora (o la que asigne la sesión, que se apunta en la bitácora nada más
  empezar).
- **Cada sesión, su propia rama**: dos sesiones a la vez nunca suben a la misma rama. Si la rama de la bitácora ya la
  usa otra sesión, crea `claude/<tema>` desde ella y escribe solo en tu parte de la bitácora. Lo tuyo vuelve por
  `git merge` antes de ir a `main`.
- **Con `logRows: true`**, tu fila de la bitácora se reescribe con `python3 .claude/gw/scripts/handoff.py set-row
  "texto"` a mitad de tarea y se cierra con `python3 .claude/gw/scripts/handoff.py close-row <rama>` en el último
  commit antes de su PR; no edites a mano la de otra rama.
- Merge, nunca rebase: las ramas están subidas.
- **A `main` solo con confirmación de la persona**, y se apunta en la bitácora. Según `pushToProtected`
  de `.claude/gw.json`, se sube directo (`direct`: `.githooks/pre-push` pide la marca de revisión) o por pull request
  (`pr`: un gancho de Claude Code pide la marca antes de crearlo o fusionarlo; un push directo la sigue pidiendo).
- **Se fusiona solo con el CI en verde**, también cuando la persona dice «fusiona directamente»: eso quita esperar a
  más revisiones, nunca el CI ni la retro presentada a la persona. Si el CI no arranca, vale el check en local de
  «Relevos» con la confirmación de la persona: se sube directo (el `pre-push` corre el check) o, para un pull
  request, `python3 .claude/gw/scripts/ci-local.py --record` corre el CI en local y lo apunta; con esa línea verde
  subida, el gancho deja fusionar.
- La rama de un subagente vuelve con `bash .claude/gw/scripts/merge-branch.sh <rama> $'<mensaje>\n\nSiguiente: <próximo paso>'`
  (el mensaje acaba con el trailer que exige el `commit-msg`), que corre el check y los tests
  relacionados, y limpia su worktree.

## Antes de ir a `main`: tres fases

Nunca sobre trabajo ya fusionado.

1. **Código:** `git fetch origin main` y revisión del diff contra `origin/main` con
   todos los hallazgos (en Claude Code, `/code-review --max-findings all`), con el criterio de `REVIEW.md`. Arreglos
   con commit y subidos: lo grave o medio y lo que el propio arreglo rompe; lo leve se apunta como pendiente en la
   bitácora y no vuelve a revisarse en ese PR. Solo el código necesita revisión: lo que casa con `content` de `.claude/gw.json` es
   contenido. Tampoco se revisa lo copiado tal cual del flujo (`vendored`;
   `python3 .claude/gw/scripts/review-scope.py --workflow <repo del flujo>` lista lo que sí: uno editado en el
   proyecto entra). Un diff trivial (`review-scope.py --trivial` sale en 0: sin código o de `reviewTrivialLines` líneas o menos) se
   revisa en la sesión, sin subagente; los arreglos de la revisión van a un subagente `sonnet`, salvo ganchos, guardas, seguridad y los
   scripts que llaman (`opus`, como en `gw-orchestrate-dealer`).
   **En una rama larga, esta fase se adelanta a cada bloque cerrado:** revisión solo del diff desde la
   última revisión de bloque (el último commit con el trailer `Findings:`; el `commit-msg` avisa cuando el bloque pasa
   de `changeSize.block` líneas), para que una sola revisión de muchos commits no deje módulos sin mirar; antes de `main`, solo lo que quede desde entonces.
2. **Entorno:** la skill `gw-opt-tokens` y luego `retro` (más `/gw-opt-ai` si hubo medidas con un modelo de IA local: la lanza la persona, el agente se lo pide). Sus
   propuestas se **presentan a la persona**; lo que confirme se aplica en la rama. Una retro escrita sin presentarla no
   vale. Si la persona pidió ir a `main` y no está para decidir la retro, se deja todo listo (retro con
   `**Estado:** pendiente`, check en verde sobre la fusión con `main`, descripción del pull request) y
   se para antes de `reviewed.sh`: su confirmación de la retro es el único paso que falta; la decisión no se escribe
   por ella.
3. **Cierre:** si la fase 2 trajo código, revisión solo de esos commits y sus arreglos; luego
   `bash .claude/gw/scripts/reviewed.sh` (escribe la marca de revisión, `docs/records/reviewed.txt`, y hace su commit) y
   `git push`; para un pull request, su descripción con la skill `pr`. Solo entonces se sube a `main`
   o se crea el pull request. Sin la marca del mismo commit, los ganchos lo rechazan.

## Subagentes

**Reparto a subagentes autorizado:** el trabajo de más de un paso se reparte a subagentes de contexto limpio con la
skill `gw-orchestrate-dealer` (y los modelos que elija la skill `gw-selector`) sin preguntar cada vez; la sesión principal
planea, decide y revisa. Esta línea es la autorización que piden las instrucciones del propio agente.

- Cada subagente recibe un encargo: objetivo, rutas, restricciones, el check que debe pasar y qué tiene que devolver.
- Otros repositorios se leen con un subagente que devuelve un resumen con rutas; desde aquí nunca se modifican.

## Reglas del proyecto

<!-- Las rellena el proyecto: stack, cómo se arranca, lo que nunca se hace, reglas del dominio, dónde está cada cosa.
     Breve; una regla comprobable se convierte en un script. -->

Portal público de la marca **Galivelop** (Galicia + Develop), publicado en GitHub Pages desde `main`. Cómo funciona,
cómo añadir un proyecto y cómo se publica: [`docs/desarrollo.md`](docs/desarrollo.md). Flujo de skills y modelos:
[`docs/runbooks/skills-y-modelos.md`](docs/runbooks/skills-y-modelos.md); vocabulario: [`GLOSSARY.md`](GLOSSARY.md).

- Instalar: `npm ci`. Comprobar: `npm run check` (tsc, vitest y `tools/qa/tests/test-ganchos.sh`); la web:
  `npm run build`.
- Commits en español (primera línea, cuerpo con qué queda y el check, última línea `Siguiente: <paso>`).
- **`main` es la web publicada.** Se sube directo (`pushToProtected: direct`), solo con confirmación expresa del
  usuario, salvo la tarea semanal (abajo). Diferencia con el flujo: `/gw-opt-tokens` y `/retro` (fase 2) solo cuando el
  cambio de código es grande (componentes, estilos, scripts de build, ganchos); un cambio pequeño de código pasa
  por la fase 1 y la 3. Por eso `requireRetro` está a `false` en `.claude/gw.json`.
- **Publicación semanal** (2026-10-13): los domingos por la noche, la tarea «Proyectos semanal» pone al día las fichas
  de cada proyecto y sube `claude/galivelop-dev-portal-1h89ci` a `main` **sin pedir confirmación** (solo ella; solo
  contenido). Por eso **la rama de trabajo está siempre publicable**: todo código que entre lleva su `/code-review` y
  su marca antes del domingo, y lo hecho entre semana va a «Para la próxima publicación» de la bitácora. Detalle y
  cómo añadir un proyecto: [`docs/runbooks/tarea-semanal.md`](docs/runbooks/tarea-semanal.md#reglas); lo hace la skill
  `gw-portal`, que también se usa en una sesión para revisar los repos (modo informe) o aplicar sus cambios.
- **Todo texto visible, en castellano, gallego e inglés** (`visibleLanguages`); `npm run check` lo comprueba. Un
  subagente que escriba textos lo recibe en su encargo.
- El código de cada proyecto se enlaza desde su ficha (`enlaces`, tipo `otro`) cuando su repo es público. Si el repo es privado, no se enlaza: solo su versión pública.
- **Mensaje de la marca** (ADR [0001](docs/adr/0001-encargos-por-miembro.md), [0002](docs/adr/0002-marca-taller-y-productos.md),
  [0003](docs/adr/0003-codigo-abierto-e-implantacion.md) y [0004](docs/adr/0004-productos-en-el-perfil.md)): lee [«Mensaje»](docs/desarrollo.md#mensaje) antes de
  escribir cualquier texto de la web, el README o una ficha.
- Al sacar información de otro repo (Tarkor, toVeriAI…), solo se lee: nunca se modifica desde aquí.
- Riesgo alto (esperar al usuario aunque el `gw-selector` diga seguir): borrar contenido publicado y cambiar rutas que
  ya están indexadas.

### Notas del portal para las skills

Las skills de `.claude/skills/` son copia del flujo y no se editan aquí (las pisa `/gw-update`), salvo las nacidas en
el portal (`gw-portal`, `gw-seo`), que `/gw-update` no toca y `gw-harvest` recoge desde el flujo; lo propio del portal
va aquí, en `.claude/gw.json` (`selector.cases`) o en `.claude/gw/gw-opt-tokens.md`.

- `research`: cada afirmación con su fuente primaria y la fecha de consulta; las notas, en `docs/investigacion/<tema>.md`.
- `domain-modeling`: glosario y ADR en español. `GLOSSARY.md` es el vocabulario del portal (proyecto, ficha,
  apartado, línea de trabajo…); los términos de Tarkor viven en su repositorio y aquí solo se enlazan. ADR en `docs/adr/`.
- `pr`: también para el resumen al usuario cuando se sube directo. **Evidencia:** los números de `npm run check`, el
  build (páginas estáticas generadas) y, para cambios visibles, captura antes/después en escritorio y móvil.
  **Peligro:** un cambio de rutas, de `scripts/paginas-estaticas.mjs` o de `index.html` afecta al SEO y a enlaces ya
  compartidos.
- `prototype`: sobre todo la rama de UI (variantes de una sección, de la galería o de una tarjeta). Con la
  herramienta `Artifact`, publícalo y pon el enlace (el usuario lo abre desde el móvil); si no, `SendUserFile`. Las
  variantes se borran al elegir; el veredicto va a la bitácora. **Con `Artifact` lo publica un subagente** (fork o
  encargo con el HTML) que devuelve solo la URL: la respuesta del `quickstart` (~10k tokens) se arrastra en la
  sesión principal hasta la compactación.
- `grilling`: lo decidido va a la bitácora o a `docs/desarrollo.md`; se respeta el mensaje de la marca y estas
  reglas. Las referencias de diseño (`designReferences`) se buscan con `WebSearch` y se cita de dónde sale cada
  recomendación.
- `improve-codebase-architecture`: cada candidata aceptada entra en «Pendiente» de la bitácora.
- `retro`: lo revisado es lo que va a entrar en `main` (sus commits y la bitácora); antes de proponer, mira la tabla
  de [`.claude/skills/README.md`](.claude/skills/README.md). Las propuestas generales del flujo van a
  `## For Galivelop-workflow` del archivo de la retro.
