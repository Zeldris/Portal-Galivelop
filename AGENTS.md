<!-- galivelop-workflow v0.1.0 -->
# Portal-Galivelop — instrucciones para agentes

Este proyecto se trabaja por relevos: una sesión puede acabarse en cualquier momento (tokens, contenedor, cambio de
cuenta) y la siguiente tiene que seguir **sin perder nada y sin preguntar por dónde iba**. Todo lo de este archivo
existe para eso. El flujo es Galivelop-workflow v0.1.0; sus scripts están en `.claude/gw/scripts/`, sus skills
en `.claude/skills/` y su configuración en `.claude/gw.json` (solo la lee `.claude/gw/scripts/config.py`).

## Al empezar cualquier sesión

1. Lee la bitácora, `docs/traspaso.md`: rama, tarea en curso, qué falta y siguiente paso.
2. `git fetch origin <rama>` y comprueba que el último commit coincide con lo que dice la bitácora.
3. Comprueba que el check está en verde antes de tocar nada: `npm run check`.
4. Sigue por el **siguiente paso** de la bitácora, salvo que el usuario pida otra cosa.
5. Al empezar cada tarea, trae la rama protegida: `git fetch origin main` y, si trae commits,
   `git merge origin/main` (merge, nunca rebase: las ramas están subidas). Si el conflicto toca la
   misma lógica por los dos lados, se para y se consulta al usuario.
6. **La sesión se abre con el repo como carpeta de trabajo.** Abierta en otra (una que contiene varios repos, la
   carpeta personal), no carga `.claude/settings.json`: ni el tope de compactación, ni el gancho de inicio, ni el que
   vigila la subida a la rama protegida. Si pasa, dilo al usuario para que la reabra desde el repo; mientras tanto,
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
- **Tras una llamada interrumpida o rechazada, `git status` y `git diff` antes de repetirla**: el cambio puede
  haberse guardado, o incluso subido, y repetirlo lo duplica.
- Si el usuario dice que se para, se para: se sube lo que haya, se deja la bitácora al día y no se sigue con nada más.
- **Al cerrar una fase** (o una tarea grande), con la bitácora al día, se recomienda `/clear` antes de la siguiente: el contexto
  largo es casi todo el gasto, y la bitácora basta para retomar.
- **Al cerrar cada bloque o fase, mira el CI de la última subida.** Un CI que no arranca (sin cuota, sin runners)
  cuenta como rojo: se dice al usuario y no se da nada por comprobado en el CI.

## Comprobar

- **El check del proyecto:** `npm run check`. `.githooks/pre-push` lo corre sobre el commit que se sube, y el CI
  (`.github/workflows/comprobar.yml`) en cada push fuera de `main` y en cada pull request.
- **Lo comprobable lo hace un script**, no un agente: las skills y guías solo deciden lo que exige criterio. Si una
  regla se sigue rompiendo, se convierte en una comprobación.
- **Lo que depende de una máquina concreta no se da por probado con tests** (otro sistema operativo, un dispositivo,
  el equipo del usuario): se apunta como pendiente en el plan, con quién lo comprueba y dónde.
- Un test nuevo tiene que fallar sin su arreglo: `bash .claude/gw/scripts/rojo-sin-arreglo.sh "<orden del test>"
  <archivo-del-arreglo>...`.
- `python3 .claude/gw/scripts/doctor.py` dice si el flujo está bien montado, con la orden que arregla cada problema.

## Mensajes de commit

- Primera línea: qué cambia, en el idioma del proyecto, con los identificadores de las tareas tocadas.
- Cuerpo: qué se hizo, qué queda de esa tarea si no está cerrada, y estado del check.
- **Última línea: `Siguiente: <próximo paso concreto>`**, en el mismo bloque final que las líneas de atribución.

## Ramas y `main`

- Se trabaja en la rama que indique la bitácora (o la que asigne la sesión, que se apunta en la bitácora nada más
  empezar).
- **Cada sesión, su propia rama**: dos sesiones a la vez nunca suben a la misma rama. Si la rama de la bitácora ya la
  usa otra sesión, crea `claude/<tema>` desde ella y escribe solo en tu parte de la bitácora. Lo tuyo vuelve por
  `git merge` antes de ir a `main`.
- Merge, nunca rebase: las ramas están subidas.
- **A `main` solo con confirmación del usuario**, y se apunta en la bitácora. Según `pushToProtected`
  de `.claude/gw.json`, se sube directo (`direct`: `.githooks/pre-push` pide la marca de revisión) o por pull request
  (`pr`: un gancho de Claude Code pide la marca antes de crearlo o fusionarlo; un push directo la sigue pidiendo).
- **Se fusiona solo con el CI en verde**, también cuando el usuario dice «fusiona directamente»: eso quita esperar a
  más revisiones, nunca el CI ni la retro presentada al usuario.
- La rama de un subagente vuelve con `bash .claude/gw/scripts/fusionar.sh <rama> "<mensaje>"`, que corre el check y
  limpia su worktree.

## Antes de ir a `main`: tres fases

Nunca sobre trabajo ya fusionado.

1. **Código:** `git fetch origin main` y revisión del diff contra `origin/main` con
   todos los hallazgos (en Claude Code, `/code-review --max-findings all`), con el criterio de `REVIEW.md`. Arreglos
   con commit y subidos. Solo el código necesita revisión: lo que casa con `content` de `.claude/gw.json` es
   contenido.
2. **Entorno:** la skill `opt-tokens` y luego `retro` (más `opt-ai` si hubo medidas con un modelo de IA local). Sus
   propuestas se **presentan al usuario**; lo que confirme se aplica en la rama. Una retro escrita sin presentarla no
   vale.
3. **Cierre:** si la fase 2 trajo código, revisión solo de esos commits y sus arreglos; luego
   `bash .claude/gw/scripts/revisado.sh` (escribe la marca de revisión, `docs/registros/revisado.txt`, y hace su commit) y
   `git push`; para un pull request, su descripción con la skill `pr`. Solo entonces se sube a `main`
   o se crea el pull request. Sin la marca del mismo commit, los ganchos lo rechazan.

## Subagentes

**Reparto a subagentes autorizado:** el trabajo de más de un paso se reparte a subagentes de contexto limpio con la
skill `orchestrate-dealer` (y los modelos que elija la skill `selector`) sin preguntar cada vez; la sesión principal
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
  usuario, salvo la tarea semanal (abajo). Diferencia con el flujo: `/opt-tokens` y `/retro` (fase 2) solo cuando el
  cambio de código es grande (componentes, estilos, scripts de build, ganchos); un cambio pequeño de código pasa
  por la fase 1 y la 3. Por eso `requireRetro` está a `false` en `.claude/gw.json`.
- **Publicación semanal** (decisión y consentimiento del usuario, 2026-10-13): la web se actualiza los **domingos por
  la noche**. La tarea programada «Tarkor semanal» revisa el avance de Tarkor, actualiza su ficha y sube la rama de
  trabajo (`claude/galivelop-dev-portal-1h89ci`) a `main` **sin pedir confirmación** (autorizado para esa tarea).
  Gasta los mínimos tokens: lee solo la bitácora del juego y los commits desde la última fecha de `actualizado`.
  Solo toca contenido (`src/data/`, `public/`, `docs/`), así que no necesita revisión mientras la marca de
  `docs/registros/revisado.txt` cubra todo el código: **la rama de trabajo tiene que estar siempre publicable** y
  todo código que entre en ella lleva su `/code-review` y su marca antes del domingo. Entre semana, lo hecho se
  apunta en «Para la próxima publicación» de la bitácora. Fuera de esa tarea, `main` sigue necesitando confirmación.
- **Todo texto visible, en castellano, gallego e inglés** (`visibleLanguages`); `npm run check` lo comprueba. Un
  subagente que escriba textos lo recibe en su encargo.
- No se enlaza el código de los proyectos (sus repos son privados): solo su versión pública.
- Mensaje de la marca (2026-10-04): Galivelop es un **taller** (crear, investigar, innovar, aprender), abierto a
  colaborar y sin ánimo de vender en la web: expone los proyectos. Galicia es solo una mención (el nombre), no la
  base del mensaje. Marca: azul celeste y blanco de la bandera gallega, sin copiar su composición.
- Al sacar información de otro repo (Tarkor, toVeriAI…), solo se lee: nunca se modifica desde aquí.
- Riesgo alto (esperar al usuario aunque el `selector` diga seguir): borrar contenido publicado y cambiar rutas que
  ya están indexadas.

### Notas del portal para las skills

Las skills de `.claude/skills/` son copia del flujo y no se editan aquí (las pisa `/gw-update`); lo propio del portal
va aquí, en `.claude/gw.json` (`selector.cases`) o en `.claude/gw/opt-tokens.md`.

- `research`: cada afirmación con su fuente primaria y la fecha de consulta; las notas, en `docs/investigacion/<tema>.md`.
- `domain-modeling`: glosario y ADR en español. `GLOSSARY.md` es el vocabulario del portal (proyecto, ficha,
  apartado, línea de trabajo…); los términos de Tarkor viven en su repositorio y aquí solo se enlazan. ADR en `docs/adr/`.
- `pr`: también para el resumen al usuario cuando se sube directo. **Evidencia:** los números de `npm run check`, el
  build (páginas estáticas generadas) y, para cambios visibles, captura antes/después en escritorio y móvil.
  **Peligro:** un cambio de rutas, de `scripts/paginas-estaticas.mjs` o de `index.html` afecta al SEO y a enlaces ya
  compartidos.
- `prototype`: sobre todo la rama de UI (variantes de una sección, de la galería o de una tarjeta). Con la
  herramienta `Artifact`, publícalo y pon el enlace (el usuario lo abre desde el móvil); si no, `SendUserFile`. Las
  variantes se borran al elegir; el veredicto va a la bitácora.
- `grilling`: lo decidido va a la bitácora o a `docs/desarrollo.md`; se respeta el mensaje de la marca y estas
  reglas. Las referencias de diseño (`designReferences`) se buscan con `WebSearch` y se cita de dónde sale cada
  recomendación.
- `improve-codebase-architecture`: cada candidata aceptada entra en «Pendiente» de la bitácora.
- `retro`: lo revisado es lo que va a entrar en `main` (sus commits y la bitácora); antes de proponer, mira la tabla
  de [`.claude/skills/README.md`](.claude/skills/README.md). Las propuestas generales del flujo van a
  `## For Galivelop-workflow` del archivo de la retro.
